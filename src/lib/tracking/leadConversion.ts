// Conversión de un lead de Ópera. La emite el formulario una sola vez, cuando el servidor confirma el lead.
//
// Son los mismos tres eventos que antes emitía la página /thankyou: el evento de dataLayer que escucha
// GTM, la conversión de Google Ads con la etiqueta de Ópera y el Lead del píxel de Meta.
//
// `eventId` identifica al lead: va como `transaction_id` en Ads y como `eventID` en Meta, para poder deduplicar.

const ADS_CONVERSION = "AW-17962976949/TyATCOr4nKccELWNtfVC";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function newEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function trackLeadConversion(eventId: string): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "conversion_event_signup_2", origin: "opera" });
  window.gtag?.("event", "conversion", { send_to: ADS_CONVERSION, transaction_id: eventId });
  window.fbq?.("track", "Lead", { content_name: "opera" }, { eventID: eventId });
}
