import { NextRequest } from 'next/server'
import { test, expect } from '@playwright/test'

import { POST as postLead } from '@/app/api/lead/route'

type Call = { method: string; url: string; body: unknown; signal?: AbortSignal | null }

// Valores válidos del enum fuente_del_lead en HubSpot. Cualquier otro devuelve 400.
const FUENTES_VALIDAS = ['Ads', 'Orgánico', 'Referido', 'Outbound/Piloto BBDD', 'MetaRecsa']

// Simula HubSpot (y Meta). `contactPost` define las respuestas sucesivas al crear el contacto.
function mockHubspot(
  opts: { contactPost?: { status: number; json: unknown }[]; capiStatus?: number; assocStatus?: number } = {}
) {
  const calls: Call[] = []
  let contactPosts = 0
  const original = globalThis.fetch
  globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
    const method = init.method ?? 'GET'
    const body = init.body ? JSON.parse(String(init.body)) : undefined
    calls.push({ method, url, body, signal: init.signal })
    const json = (status: number, data: unknown) =>
      new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
    if (url.includes('/contacts/search')) return json(200, { total: 0, results: [] })
    if (method === 'POST' && url.endsWith('/crm/v3/objects/contacts')) {
      const r = opts.contactPost?.[contactPosts++] ?? { status: 201, json: { id: '77' } }
      return json(r.status, r.json)
    }
    if (url.endsWith('/crm/v3/objects/deals')) return json(201, { id: '88' })
    if (url.includes('/associations/contacts/')) return json(opts.assocStatus ?? 200, {})
    if (url.includes('graph.facebook.com')) return json(opts.capiStatus ?? 200, {})
    return json(200, {})
  }) as typeof fetch
  return { calls, restore: () => (globalThis.fetch = original) }
}

const contactWrites = (calls: Call[]) =>
  calls.filter((c) => c.method === 'POST' && c.url.endsWith('/crm/v3/objects/contacts'))
const capiCalls = (calls: Call[]) => calls.filter((c) => c.url.includes('graph.facebook.com'))
const propsOf = (c: Call) => (c.body as { properties: Record<string, string> }).properties

const leadPayload = {
  nombre: 'Ana',
  apellido: 'Pérez',
  empresa: 'Acme',
  email: 'ana@acme.cl',
  telefono: '+56911111111',
  facturas_pendientes: '10-50',
  alguien_cobrando: 'No',
}

const req = (payload: unknown) =>
  new NextRequest('http://localhost/api/lead', { method: 'POST', body: JSON.stringify(payload) })

test.beforeEach(() => {
  process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
  delete process.env.META_PIXEL_ID
  delete process.env.META_CAPI_TOKEN
})

test.describe('/api/lead: atribución', () => {
  test('lead con gclid y campaña de Opera manda Ads, Google y google_search_opera', async () => {
    const m = mockHubspot()
    try {
      const res = await postLead(req({ ...leadPayload, gclid: 'abc', utmCampaign: '24170007327' }))
      expect(res.status).toBe(200)
      const props = propsOf(contactWrites(m.calls)[0])
      expect(FUENTES_VALIDAS).toContain(props.fuente_del_lead)
      expect(props.fuente_del_lead).toBe('Ads')
      expect(props.origen).toBe('Google')
      expect(props.origen_detalle).toBe('google_search_opera')
      expect(props.interes_del_producto).toBe('Opera')
    } finally {
      m.restore()
    }
  })

  test('gbraid cuenta como Google Ads', async () => {
    const m = mockHubspot()
    try {
      await postLead(req({ ...leadPayload, gbraid: 'gb1' }))
      const props = propsOf(contactWrites(m.calls)[0])
      expect(props.origen).toBe('Google')
      expect(props.origen_detalle).toBe('google_sin_utm')
    } finally {
      m.restore()
    }
  })

  test('lead con fbclid es Ads y Meta, nunca "Meta Ads"', async () => {
    const m = mockHubspot()
    try {
      await postLead(req({ ...leadPayload, fbclid: 'fb1' }))
      const props = propsOf(contactWrites(m.calls)[0])
      expect(props.fuente_del_lead).toBe('Ads')
      expect(props.origen).toBe('Meta')
    } finally {
      m.restore()
    }
  })

  test('pago de una plataforma desconocida no manda origen', async () => {
    const m = mockHubspot()
    try {
      await postLead(req({ ...leadPayload, utmSource: 'bing', utmMedium: 'cpc' }))
      const props = propsOf(contactWrites(m.calls)[0])
      expect(props.origen_detalle).toBe('pagado_otra_plataforma')
      expect(props).not.toHaveProperty('origen')
    } finally {
      m.restore()
    }
  })

  test('lead sin señales es orgánico', async () => {
    const m = mockHubspot()
    try {
      await postLead(req(leadPayload))
      const props = propsOf(contactWrites(m.calls)[0])
      expect(props.fuente_del_lead).toBe('Orgánico')
      expect(props.origen_detalle).toBe('organico_directo')
    } finally {
      m.restore()
    }
  })

  test('manda utm_campaign y utm_term, y omite gclid si no llegó', async () => {
    const m = mockHubspot()
    try {
      await postLead(req({ ...leadPayload, utmCampaign: '999', utmTerm: 'cobranza' }))
      const props = propsOf(contactWrites(m.calls)[0])
      expect(props.utm_campaign).toBe('999')
      expect(props.utm_term).toBe('cobranza')
      expect(props).not.toHaveProperty('gclid')
    } finally {
      m.restore()
    }
  })
})

test.describe('/api/lead: validación y fallos', () => {
  test('rechaza un payload sin campos requeridos sin llamar a HubSpot', async () => {
    const m = mockHubspot()
    try {
      const res = await postLead(req({ nombre: 'Ana' }))
      expect(res.status).toBe(400)
      expect(m.calls).toHaveLength(0)
    } finally {
      m.restore()
    }
  })

  test('si HubSpot falla responde 502, no un éxito silencioso', async () => {
    const m = mockHubspot({ contactPost: [{ status: 500, json: { message: 'boom' } }] })
    try {
      const res = await postLead(req(leadPayload))
      expect(res.status).toBe(502)
      expect(await res.json()).toMatchObject({ ok: false })
      expect(contactWrites(m.calls)).toHaveLength(1)
    } finally {
      m.restore()
    }
  })

  test('el log de error no incluye datos personales', async () => {
    const m = mockHubspot({
      contactPost: [{ status: 500, json: { message: 'fail for ana@acme.cl +56911111111' } }],
    })
    const logs: string[] = []
    const original = console.error
    console.error = (...a: unknown[]) => void logs.push(a.join(' '))
    try {
      await postLead(req(leadPayload))
      const salida = logs.join(' | ')
      expect(salida).not.toContain('ana@acme.cl')
      expect(salida).not.toContain('+56911111111')
    } finally {
      console.error = original
      m.restore()
    }
  })
})

test.describe('/api/lead: un campo de clasificación rechazado no pierde el lead', () => {
  const CLASIFICACION = ['origen', 'origen_detalle', 'fuente_del_lead', 'sena_prioridad', 'etapa_del_lead']

  test('ante 400 INVALID_OPTION reintenta sin clasificación y responde ok', async () => {
    const m = mockHubspot({
      contactPost: [
        { status: 400, json: { errors: [{ code: 'INVALID_OPTION', message: 'fuente_del_lead' }] } },
        { status: 201, json: { id: '77' } },
      ],
    })
    try {
      const res = await postLead(req({ ...leadPayload, gclid: 'abc' }))
      expect(res.status).toBe(200)
      const writes = contactWrites(m.calls)
      expect(writes).toHaveLength(2)
      const reintento = propsOf(writes[1])
      for (const k of CLASIFICACION) expect(reintento).not.toHaveProperty(k)
      expect(reintento.email).toBe(leadPayload.email)
      expect(reintento.firstname).toBe('Ana')
    } finally {
      m.restore()
    }
  })

  test('ante PROPERTY_DOESNT_EXIST también guarda el lead sin clasificación', async () => {
    const m = mockHubspot({
      contactPost: [
        {
          status: 400,
          json: { message: 'Property values were not valid: [{"error":"PROPERTY_DOESNT_EXIST","name":"origen_detalle"}]' },
        },
        { status: 201, json: { id: '78' } },
      ],
    })
    try {
      const res = await postLead(req({ ...leadPayload, gclid: 'abc' }))
      expect(res.status).toBe(200)
      expect(contactWrites(m.calls)).toHaveLength(2)
    } finally {
      m.restore()
    }
  })

  test('un error que no es de clasificación no se reintenta y responde 502', async () => {
    const m = mockHubspot({ contactPost: [{ status: 500, json: { message: 'boom' } }] })
    try {
      const res = await postLead(req(leadPayload))
      expect(res.status).toBe(502)
      expect(contactWrites(m.calls)).toHaveLength(1)
    } finally {
      m.restore()
    }
  })
})

test.describe('/api/lead: Meta CAPI solo reporta lo que el CRM guardó', () => {
  test.beforeEach(() => {
    process.env.META_PIXEL_ID = 'pixel-1'
    process.env.META_CAPI_TOKEN = 'capi-token'
  })

  test('envía el evento Lead después de guardar en HubSpot', async () => {
    const m = mockHubspot()
    try {
      const res = await postLead(req({ ...leadPayload, fbclid: 'fb1' }))
      expect(res.status).toBe(200)
      const capi = capiCalls(m.calls)
      expect(capi).toHaveLength(1)
      const iContacto = m.calls.findIndex((c) => c.method === 'POST' && c.url.endsWith('/crm/v3/objects/contacts'))
      expect(m.calls.indexOf(capi[0])).toBeGreaterThan(iContacto)
    } finally {
      m.restore()
    }
  })

  test('manda a Meta el mismo event_id que el píxel del navegador', async () => {
    const m = mockHubspot()
    try {
      const eventId = '3F2504E0-4F89-41D3-9A0C-0305E82C3301'
      await postLead(req({ ...leadPayload, eventId }))
      const evento = (capiCalls(m.calls)[0].body as { data: { event_id: string }[] }).data[0]
      expect(evento.event_id).toBe(eventId.toLowerCase())
    } finally {
      m.restore()
    }
  })

  test('sin eventId válido, Meta recibe un event_id generado en el servidor', async () => {
    const m = mockHubspot()
    try {
      await postLead(req({ ...leadPayload, eventId: 'no-es-uuid' }))
      const evento = (capiCalls(m.calls)[0].body as { data: { event_id: string }[] }).data[0]
      expect(evento.event_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
      expect(evento.event_id).not.toBe('no-es-uuid')
    } finally {
      m.restore()
    }
  })

  test('no reporta a Meta si HubSpot falla', async () => {
    const m = mockHubspot({ contactPost: [{ status: 500, json: { message: 'boom' } }] })
    try {
      const res = await postLead(req(leadPayload))
      expect(res.status).toBe(502)
      expect(capiCalls(m.calls)).toHaveLength(0)
    } finally {
      m.restore()
    }
  })

  test('si Meta responde error registra el status sin datos personales y el lead sigue ok', async () => {
    const m = mockHubspot({ capiStatus: 400 })
    const logs: string[] = []
    const original = console.error
    console.error = (...a: unknown[]) => void logs.push(a.join(' '))
    try {
      const res = await postLead(req({ ...leadPayload, fbclid: 'fb1' }))
      expect(res.status).toBe(200)
      const salida = logs.join(' | ')
      expect(salida).toContain('[CAPI]')
      expect(salida).toContain('400')
      expect(salida).not.toContain('ana@acme.cl')
    } finally {
      console.error = original
      m.restore()
    }
  })

  test('el envío a Meta usa un timeout de 2 s', async () => {
    const m = mockHubspot()
    const timeouts: number[] = []
    const original = AbortSignal.timeout
    AbortSignal.timeout = (ms: number) => (timeouts.push(ms), original.call(AbortSignal, ms))
    try {
      await postLead(req({ ...leadPayload, fbclid: 'fb1' }))
      expect(timeouts).toContain(2000)
      expect(timeouts).not.toContain(5000)
    } finally {
      AbortSignal.timeout = original
      m.restore()
    }
  })
})

test.describe('/api/lead: asociación deal-contacto', () => {
  test('si la asociación falla responde 502 sin datos personales en el log', async () => {
    const m = mockHubspot({ assocStatus: 500 })
    const logs: string[] = []
    const original = console.error
    console.error = (...a: unknown[]) => void logs.push(a.join(' '))
    try {
      const res = await postLead(req(leadPayload))
      expect(res.status).toBe(502)
      expect(logs.join(' | ')).toContain('status=500')
      expect(logs.join(' | ')).not.toContain('ana@acme.cl')
    } finally {
      console.error = original
      m.restore()
    }
  })

  test('si la asociación funciona responde ok', async () => {
    const m = mockHubspot()
    try {
      const res = await postLead(req(leadPayload))
      expect(res.status).toBe(200)
    } finally {
      m.restore()
    }
  })
})
