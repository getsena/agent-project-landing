import { test, expect, type Page } from '@playwright/test'

// Landing de producto de Sena Ópera. Corre contra un servidor local:
//
//   yarn build && yarn start -p 39847
//   E2E_BASE_URL=http://localhost:39847 yarn playwright test tests/e2e/opera.spec.ts
const BASE = process.env.E2E_BASE_URL
test.skip(!BASE, 'sin E2E_BASE_URL')
test.use({ baseURL: BASE })

// /api/lead interceptado: el test no toca HubSpot.
async function interceptLead(page: Page, status = 200, body: unknown = { ok: true }) {
  const sent: unknown[] = []
  await page.route('**/api/lead', async (route) => {
    sent.push(route.request().postDataJSON())
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  })
  return sent
}

async function completarPaso2(page: Page) {
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByLabel('Nombre', { exact: true }).fill('Ana Pérez')
  await page.getByLabel('Empresa', { exact: true }).fill('Acme SpA')
  await page.getByLabel('Email de trabajo', { exact: true }).fill('ana@acme.cl')
  await page.getByLabel('Teléfono', { exact: true }).fill('911112222')
}

test('el HTML del servidor trae el copy aprobado, un solo H1 y el JSON-LD', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
  expect(html).toContain('<title>Sena Ópera · Tu equipo de cobranza B2B externo</title>')
  expect(html).toContain('rel="canonical" href="https://agente.somossena.com"')
  for (const texto of ['US$50', 'US$300', 'Empresas que ya cobran con Sena', 'Te respondemos en 24 horas']) {
    expect(html).toContain(texto)
  }
  for (const retirado of ['146M', '40+', '15 países', 'agresiva', '48 horas', 'Sin compromiso', 'flujolink', 'Opera by']) {
    expect(html, retirado).not.toContain(retirado)
  }
  const ld = JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/s.exec(html)?.[1] ?? '{}')
  const service = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'Service')
  const faq = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'FAQPage')
  expect(service.name).toBe('Sena Ópera')
  expect(service.offers.map((o: { price: string }) => o.price)).toEqual(['50', '300'])
  expect(faq.mainEntity).toHaveLength(6)
})

test('la demo cambia de etapa con las pestañas', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: 'Acuerdo' }).click()
  await expect(page.getByText('Un compromiso. Un próximo paso claro.')).toBeVisible()
})

test('formulario: paso 1, paso 2 y gracias en el mismo formulario', async ({ page }) => {
  const sent = await interceptLead(page)
  await page.goto('/?utm_source=google&utm_medium=cpc&utm_campaign=test-e2e&gclid=test-gclid-123')
  await completarPaso2(page)
  await page.getByRole('button', { name: 'Enviar' }).click()

  await expect(page.getByRole('heading', { name: /gracias\. recibimos tu caso/i })).toBeVisible()
  await expect(page).toHaveURL(/\/\?utm_source/)
  expect(sent).toHaveLength(1)
  expect(sent[0]).toMatchObject({
    nombre: 'Ana',
    apellido: 'Pérez',
    empresa: 'Acme SpA',
    email: 'ana@acme.cl',
    caso: { cotizar: 'habitual', tipo_cartera: 'B2B', necesidad: 'delegar', canales: ['Correo'] },
    gclid: 'test-gclid-123',
    utmCampaign: 'test-e2e',
  })
  expect((sent[0] as { telefono: string }).telefono).toMatch(/^\+5[16]911112222$/)
  expect((sent[0] as { eventId: string }).eventId).toMatch(/^[0-9a-f-]{36}$/)
})

test('formulario: el paso 2 valida los datos de contacto antes de enviar', async ({ page }) => {
  const sent = await interceptLead(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByLabel('Email de trabajo', { exact: true }).fill('no-es-email')
  await page.getByRole('button', { name: 'Enviar' }).click()
  await expect(page.getByText('Escribe un email válido.')).toBeVisible()
  await expect(page.getByText('Escribe tu nombre.')).toBeVisible()
  expect(sent).toHaveLength(0)
})

test('formulario: si el servidor falla, muestra el error y no da las gracias', async ({ page }) => {
  await interceptLead(page, 502, { ok: false, error: 'No pudimos registrar tu solicitud.' })
  await page.goto('/')
  await completarPaso2(page)
  await page.getByRole('button', { name: 'Enviar' }).click()
  await expect(page.getByRole('form').getByRole('alert')).toContainText('No pudimos registrar tu caso')
  await expect(page.getByRole('heading', { name: /gracias/i })).toHaveCount(0)
})

test('mobile 375px: sin scroll horizontal y CTA del header visible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.getByRole('banner').getByRole('link', { name: /cuéntanos tu caso/i })).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
