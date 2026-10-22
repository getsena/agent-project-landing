// Conversión de un lead de Ópera. La emite el formulario una sola vez, cuando el servidor confirma el lead.
//
// Son los mismos tres eventos que antes emitía la página /thankyou: el evento de dataLayer que escucha
// GTM, la conversión de Google Ads con la etiqueta de Ópera y el Lead del píxel de Meta.

const ADS_CONVERSION = "AW-17962976949/TyATCOr4nKccELWNtfVC";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLeadConversion(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "conversion_event_signup_2", origin: "opera" });
  window.gtag?.("event", "conversion", { send_to: ADS_CONVERSION });
  window.fbq?.("track", "Lead", { content_name: "opera" });
}
