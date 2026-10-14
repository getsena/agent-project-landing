"use client";

import { trackEvent, trackPixel } from "@/lib/analytics";
import { getAttributionPayload, landingPageUrl } from "@/lib/lead/clientAttribution";
import { useCountries } from "@/lib/services/countryService";
import { useCurrencyStore } from "@/lib/store/useCurrencyStore";
import { useToastStore } from "@/lib/store/useToastStore";
import Button from "@/ui/shared/Button";
import { TurnstileWidget, useTurnstile } from "@/ui/shared/Turnstile";
import { Input } from "@/ui/shared/Input";
import SimpleCountrySelect, {
  OptionSelect,
} from "@/ui/shared/SimpleCountrySelect";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  nombre: string;
  apellido: string;
  empresa: string;
  email: string;
  whatsapp: string;
  facturas_pendientes: string;
  alguien_cobrando: string;
};

export const FinalCTA = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstile = useTurnstile();
  const { data: countries = [] } = useCountries();
  const { ipCurrency } = useCurrencyStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const [countrySelect, setCountrySelect] = useState<string | null>(null);

  const countryOptions = useMemo(() => {
    if (!countries.length) return [];
    const priorityCountries = ["+51", "+56", "+57", "+593", "+52"];
    const priorityItems: OptionSelect[] = [];
    const otherItems: OptionSelect[] = [];
    countries.forEach((item) => {
      const option: OptionSelect = {
        id: item.country,
        label: item.country,
        icon: item.icon,
        subValue: item.country,
      };
      if (priorityCountries.includes(item.country)) {
        priorityItems.push(option);
      } else {
        otherItems.push(option);
      }
    });
    priorityItems.sort(
      (a, b) =>
        priorityCountries.indexOf(a.id) - priorityCountries.indexOf(b.id),
    );
    return [...priorityItems, ...otherItems];
  }, [countries]);

  useEffect(() => {
    const currencyMap: Record<string, string> = {
      PEN: "+51",
      CLP: "+56",
      COP: "+57",
      MXN: "+52",
      USD: "+593",
    };
    if (ipCurrency && currencyMap[ipCurrency]) {
      setCountrySelect(currencyMap[ipCurrency]);
    }
  }, [ipCurrency]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      whatsapp: "",
      facturas_pendientes: "",
      alguien_cobrando: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    trackEvent({ action: "form_submit", category: "form", label: "contact_form" });
    trackPixel("InitiateCheckout");

    const telefonoConPrefijo = (countrySelect || "") + data.whatsapp;
    setIsSubmitting(true);

    try {
      const turnstileToken = await turnstile.getToken();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          apellido: data.apellido,
          empresa: data.empresa,
          email: data.email,
          telefono: telefonoConPrefijo,
          facturas_pendientes: data.facturas_pendientes,
          alguien_cobrando: data.alguien_cobrando,
          ...getAttributionPayload(),
          landingPage: landingPageUrl(),
          "cf-turnstile-response": turnstileToken,
        }),
      });

      if (!res.ok) {
        // El token es de un solo uso: hay que pedir otro. 403 y 429 traen un mensaje pensado para el visitante.
        turnstile.reset();
        const json = await res.json().catch(() => ({}));
        if ((res.status === 403 || res.status === 429) && typeof json.error === "string") {
          showToast({ iconType: "error", message: "No pudimos enviar el formulario", subMessage: json.error });
          return;
        }
        throw new Error("API error");
      }

      reset();
      router.push("/thankyou");
    } catch {
      turnstile.reset();
      showToast({
        iconType: "error",
        message: "Error al enviar el formulario",
        subMessage: "Por favor, intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-brand-primary-dark">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-canaro font-extrabold text-3xl md:text-4xl lg:text-5xl text-white mb-5 leading-tight">
              ¿Cuánto tienes por cobrar?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl mb-10">
              Cuéntanos tu caso. En 48 horas te decimos cómo podemos ayudarte.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-brand-secondary" />
                </div>
                <span className="text-white text-lg">Sin compromisos</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-brand-secondary" />
                </div>
                <span className="text-white text-lg">Sin setup complejo</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-brand-secondary" />
                </div>
                <span className="text-white text-lg">Tú defines el ritmo</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-3xl p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <h3 className="font-canaro font-bold text-2xl text-brand-primary-dark mb-2">
                  Contactar a un especialista
                </h3>
                <p className="text-slate-500">
                  Completa el formulario y te respondemos en 48 horas
                </p>
              </div>

              <div className="flex flex-1 w-full">
                <div className="w-full">
                  {/* Campo 1 — Nombre y Apellido */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Controller
                      name="nombre"
                      control={control}
                      rules={{ required: "El nombre es obligatorio" }}
                      render={({ field }) => (
                        <Input
                          label="Nombre"
                          placeholder="Tu nombre"
                          {...field}
                          error={errors.nombre?.message}
                        />
                      )}
                    />
                    <Controller
                      name="apellido"
                      control={control}
                      rules={{ required: "El apellido es obligatorio" }}
                      render={({ field }) => (
                        <Input
                          label="Apellido"
                          placeholder="Tu apellido"
                          {...field}
                          error={errors.apellido?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Campo 2 — Empresa */}
                  <div className="mb-4">
                    <Controller
                      name="empresa"
                      control={control}
                      rules={{
                        required: "El nombre de la empresa es obligatorio",
                      }}
                      render={({ field }) => (
                        <Input
                          label="Empresa"
                          placeholder="Nombre de tu empresa"
                          {...field}
                          error={errors.empresa?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Campo 3 — Email */}
                  <div className="mb-4">
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "El email es obligatorio",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          label="Email"
                          type="email"
                          placeholder="tu@email.com"
                          {...field}
                          error={errors.email?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Campo 4 — WhatsApp */}
                  <div className="mb-4">
                    <Controller
                      name="whatsapp"
                      control={control}
                      rules={{
                        required: "El número de WhatsApp es obligatorio",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Solo se permiten números",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          label="WhatsApp"
                          type="tel"
                          placeholder="Número"
                          value={field.value || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const onlyNumbers = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            field.onChange(onlyNumbers);
                          }}
                          error={errors.whatsapp?.message}
                          leftElement={
                            <SimpleCountrySelect
                              value={countrySelect}
                              onChange={(value: string) =>
                                setCountrySelect(value)
                              }
                              options={countryOptions}
                            />
                          }
                        />
                      )}
                    />
                  </div>

                  {/* Campo 5 — ¿Cuántas facturas tienes pendientes? */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-black mb-3">
                      ¿Cuántas facturas tienes pendientes?
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="facturas_pendientes"
                      control={control}
                      rules={{ required: "Debes seleccionar una opción" }}
                      render={({ field }) => (
                        <div className="flex items-center gap-6">
                          {[
                            { value: "1-10", label: "1-10" },
                            { value: "10-50", label: "10-50" },
                            { value: "50+", label: "50+" },
                          ].map((opcion) => (
                            <label
                              key={opcion.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                value={opcion.value}
                                checked={field.value === opcion.value}
                                onChange={() => field.onChange(opcion.value)}
                                className="w-4 h-4 text-brand-primary accent-brand-primary"
                              />
                              <span className="text-sm text-black font-medium">
                                {opcion.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.facturas_pendientes && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.facturas_pendientes.message}
                      </p>
                    )}
                  </div>

                  {/* Campo 6 — ¿Alguien en tu equipo se encarga de cobrar? */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-black mb-3">
                      ¿Alguien en tu equipo se encarga de cobrar?
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="alguien_cobrando"
                      control={control}
                      rules={{ required: "Debes seleccionar una opción" }}
                      render={({ field }) => (
                        <div className="flex items-center gap-6">
                          {[
                            { value: "Sí", label: "Sí" },
                            { value: "No", label: "No" },
                            { value: "A veces", label: "A veces" },
                          ].map((opcion) => (
                            <label
                              key={opcion.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                value={opcion.value}
                                checked={field.value === opcion.value}
                                onChange={() => field.onChange(opcion.value)}
                                className="w-4 h-4 text-brand-primary accent-brand-primary"
                              />
                              <span className="text-sm text-black font-medium">
                                {opcion.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.alguien_cobrando && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.alguien_cobrando.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-5 mb-5">
                Al enviar, aceptas los{" "}
                <Link
                  href="/term"
                  className="text-brand-primary font-semibold hover:underline"
                >
                  Términos
                </Link>{" "}
                y la{" "}
                <Link
                  href="/privacy"
                  className="text-brand-primary font-semibold hover:underline"
                >
                  Política de Privacidad
                </Link>
              </p>

              <TurnstileWidget turnstile={turnstile} />

              <Button
                type="submit"
                text={
                  isSubmitting
                    ? "Enviando..."
                    : "Contactar a un especialista"
                }
                variant="secondaryFilled"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                rightIcon={
                  !isSubmitting ? (
                    <ArrowRight className="h-5 w-5" />
                  ) : undefined
                }
              />
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
