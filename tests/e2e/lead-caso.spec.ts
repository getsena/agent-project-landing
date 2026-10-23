import { readFileSync } from 'fs'
import { NextRequest } from 'next/server'
import { test, expect } from '@playwright/test'

import { POST as postLead } from '@/app/api/lead/route'
import { validateLead } from '@/lib/lead/validate'
import { trackLeadConversion } from '@/lib/tracking/leadConversion'

// Formulario de dos pasos «Cuéntanos tu caso»: manda un bloque `caso` y no trae apellido (si el visitante
// escribe un solo nombre), facturas pendientes ni «alguien cobrando». /api/lead lo acepta sin inventar
// esos campos y sigue registrando el lead como Ópera.

const caso = {
  cotizar: 'habitual',
  tipo_cartera: 'B2B',
  necesidad: 'delegar',
  canales: ['Correo', 'WhatsApp'],
  volumen_clientes: 120,
  antiguedad: '31-90',
  comentarios: 'Cartera con distribuidores.',
}

const casoLead = {
  nombre: 'Ana',
  empresa: 'Acme SpA',
  email: 'ana@acme.cl',
  telefono: '+56911111111',
  caso,
}

test.describe('validateLead con caso', () => {
  test('acepta el payload del formulario sin apellido, facturas ni «alguien cobrando»', () => {
    const r = validateLead(casoLead)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value.apellido).toBe('')
      expect(r.value.facturas_pendientes).toBe('')
      expect(r.value.alguien_cobrando).toBe('')
      expect(r.value.caso).toMatchObject({ necesidad: 'delegar', canales: ['Correo', 'WhatsApp'] })
    }
  })

  test('sin caso, apellido, facturas y «alguien cobrando» siguen siendo obligatorios', () => {
    const { caso: _, ...sinCaso } = casoLead
    void _
    expect(validateLead(sinCaso).ok).toBe(false)
  })

  test('rechaza opciones fuera de lo permitido', () => {
    for (const malo of [
      { ...caso, cotizar: 'otro' },
      { ...caso, tipo_cartera: 'B2G' },
      { ...caso, necesidad: 'todo' },
      { ...caso, canales: ['Fax'] },
      { ...caso, canales: 'Correo' },
      { ...caso, comentarios: 'a'.repeat(1001) },
      'caso',
      null,
    ]) {
      expect(validateLead({ ...casoLead, caso: malo }).ok, JSON.stringify(malo)).toBe(false)
    }
  })

  test('descarta volúmenes y antigüedad inválidos sin rechazar el lead', () => {
    const r = validateLead({
      ...casoLead,
      caso: { ...caso, volumen_clientes: -3, volumen_facturas: 1.5, antiguedad: 'siempre' },
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value.caso?.volumen_clientes).toBeUndefined()
      expect(r.value.caso?.volumen_facturas).toBeUndefined()
      expect(r.value.caso?.antiguedad).toBeUndefined()
    }
  })

  test('si vienen facturas o «alguien cobrando», se validan igual', () => {
    expect(validateLead({ ...casoLead, facturas_pendientes: '999' }).ok).toBe(false)
    expect(validateLead({ ...casoLead, alguien_cobrando: 'Quizás' }).ok).toBe(false)
  })

  test('el teléfono y el email se siguen validando', () => {
    expect(validateLead({ ...casoLead, telefono: 'abc' }).ok).toBe(false)
    expect(validateLead({ ...casoLead, email: 'ana' }).ok).toBe(false)
  })
})

test.describe('/api/lead con caso', () => {
  test.beforeEach(() => {
    process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
    delete process.env.META_PIXEL_ID
    delete process.env.META_CAPI_TOKEN
  })

  test('guarda el caso como lead de Ópera, sin prioridad ni campos inventados', async () => {
    const calls: { method: string; url: string; body: unknown }[] = []
    const original = globalThis.fetch
    globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
      const method = init.method ?? 'GET'
      calls.push({ method, url, body: init.body ? JSON.parse(String(init.body)) : undefined })
      const json = (status: number, data: unknown) =>
        new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
      if (url.includes('/contacts/search')) return json(200, { total: 0, results: [] })
      if (method === 'POST' && url.endsWith('/crm/v3/objects/contacts')) return json(201, { id: '77' })
      if (url.endsWith('/crm/v3/objects/deals')) return json(201, { id: '88' })
      return json(200, {})
    }) as typeof fetch
    try {
      const res = await postLead(
        new NextRequest('http://localhost/api/lead', { method: 'POST', body: JSON.stringify(casoLead) })
      )
      expect(res.status).toBe(200)

      const contacto = calls.find((c) => c.method === 'POST' && c.url.endsWith('/crm/v3/objects/contacts'))
      const props = (contacto?.body as { properties: Record<string, string> }).properties
      expect(props.firstname).toBe('Ana')
      expect(props.interes_del_producto).toBe('Opera')
      for (const k of ['lastname', 'sena_prioridad', 'sena_intencion', 'facturas_pendientes', 'alguien_cobrando']) {
        expect(props).not.toHaveProperty(k)
      }
      expect(props.sena_contexto).toContain('Cuéntanos tu caso')
      expect(props.sena_contexto).toContain('Principal necesidad: Delegar la gestión')
      expect(props.sena_contexto).toContain('Canales: Correo, WhatsApp')

      const negocio = calls.find((c) => c.method === 'POST' && c.url.endsWith('/crm/v3/objects/deals'))
      const deal = (negocio?.body as { properties: Record<string, string> }).properties
      expect(deal.dealname).toBe('Opera — Acme SpA')
      expect(deal.description).toContain('Tipo de cartera: B2B')
    } finally {
      globalThis.fetch = original
    }
  })

  test('con apellido, lo manda a HubSpot', async () => {
    const calls: { method: string; url: string; body: unknown }[] = []
    const original = globalThis.fetch
    globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
      const method = init.method ?? 'GET'
      calls.push({ method, url, body: init.body ? JSON.parse(String(init.body)) : undefined })
      const json = (status: number, data: unknown) =>
        new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
      if (url.includes('/contacts/search')) return json(200, { total: 0, results: [] })
      if (method === 'POST' && url.endsWith('/crm/v3/objects/contacts')) return json(201, { id: '77' })
      return json(201, { id: '88' })
    }) as typeof fetch
    try {
      const body = JSON.stringify({ ...casoLead, apellido: 'Pérez Soto' })
      await postLead(new NextRequest('http://localhost/api/lead', { method: 'POST', body }))
      const contacto = calls.find((c) => c.method === 'POST' && c.url.endsWith('/crm/v3/objects/contacts'))
      expect((contacto?.body as { properties: Record<string, string> }).properties.lastname).toBe('Pérez Soto')
    } finally {
      globalThis.fetch = original
    }
  })
})

test.describe('formulario de la landing', () => {
  const t = readFileSync('src/ui/opera/sections/CaseForm/CaseForm.tsx', 'utf8')

  test('emite una sola conversión, después de que el servidor confirma el lead', () => {
    expect(t.match(/trackLeadConversion\(eventId\)/g)).toHaveLength(1)
    expect(t.indexOf('trackLeadConversion(eventId)')).toBeGreaterThan(t.indexOf('!json.ok'))
  })

  test('la conversión de Ads lleva transaction_id y el Lead de Meta eventID, ambos el eventId del lead', () => {
    const llamadas: unknown[][] = []
    const dataLayer: Record<string, unknown>[] = []
    Object.assign(globalThis, {
      window: {
        dataLayer,
        gtag: (...a: unknown[]) => llamadas.push(['gtag', ...a]),
        fbq: (...a: unknown[]) => llamadas.push(['fbq', ...a]),
      },
    })
    try {
      trackLeadConversion('lead-123')
    } finally {
      Reflect.deleteProperty(globalThis, 'window')
    }
    expect(dataLayer).toEqual([{ event: 'conversion_event_signup_2', origin: 'opera' }])
    expect(llamadas).toEqual([
      ['gtag', 'event', 'conversion', { send_to: 'AW-17962976949/TyATCOr4nKccELWNtfVC', transaction_id: 'lead-123' }],
      ['fbq', 'track', 'Lead', { content_name: 'opera' }, { eventID: 'lead-123' }],
    ])
  })

  test('envía a /api/lead con Turnstile, atribución y el teléfono con prefijo de país', () => {
    expect(t).toContain('fetch("/api/lead"')
    expect(t).toContain('"cf-turnstile-response": turnstileToken')
    expect(t).toContain('...getAttributionPayload()')
    expect(t).toMatch(/telefono: `\$\{prefijo\}/)
  })
})
