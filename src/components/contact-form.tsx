"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { Send } from "lucide-react";
import { sendContactMessage } from "@/actions/contact";
import { CONTACT_LIMITS, type ContactErrorKey } from "@/lib/contact-schema";
import type { AppLocale } from "@/i18n/routing";

/** Estilo común de los tres campos, para no repetirlo tres veces. */
const campo =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none aria-[invalid=true]:border-destructive";

/**
 * Formulario de contacto.
 *
 * Sin validación de zod en el cliente a propósito: la Server Action ya valida,
 * y duplicar aquí las reglas significa mantenerlas en dos sitios que se
 * desincronizan a la primera. El navegador aporta lo suyo con `required` y
 * `type="email"`, que es comodidad inmediata, y el resto llega del servidor en
 * un viaje que para un formulario de contacto no se nota.
 *
 * Los errores llegan como claves (`"messageMin"`), no como frases: el servidor
 * no sabe en qué idioma está leyendo quien escribe. Aquí es donde se traducen.
 */
export function ContactForm({
  fallbackEmail,
  locale,
}: {
  /** Dirección que se ofrece cuando el envío no está disponible. */
  fallbackEmail: string;
  locale: AppLocale;
}) {
  const t = useTranslations("contactForm");
  const idiomaActual = useLocale();
  const formRef = useRef<HTMLFormElement>(null);

  const { execute, result, isPending, hasSucceeded, hasErrored } = useAction(
    sendContactMessage,
    {
      onSuccess: () => formRef.current?.reset(),
    },
  );

  const errores = result.validationErrors?.fieldErrors;

  /** Traduce la primera clave de error de un campo, si la hay. */
  function mensajeDe(campo: "name" | "email" | "message") {
    const clave = errores?.[campo]?.[0] as ContactErrorKey | undefined;
    if (!clave) return null;
    return t(`validation.${clave}`, {
      min: CONTACT_LIMITS.messageMin,
      max:
        campo === "name" ? CONTACT_LIMITS.nameMax : CONTACT_LIMITS.messageMax,
    });
  }

  const errorDeServidor = result.serverError;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        const datos = new FormData(evento.currentTarget);
        execute({
          name: String(datos.get("name") ?? ""),
          email: String(datos.get("email") ?? ""),
          message: String(datos.get("message") ?? ""),
          website: String(datos.get("website") ?? ""),
          // El idioma va en el envío porque una Server Action no tiene segmento
          // de ruta del que deducirlo, y el aviso se redacta con él.
          locale: idiomaActual === locale ? locale : idiomaActual,
        });
      }}
      className="flex flex-col gap-4"
    >
      <p className="text-sm text-muted-foreground">{t("intro")}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          id="contacto-nombre"
          name="name"
          label={t("name")}
          error={mensajeDe("name")}
          maxLength={CONTACT_LIMITS.nameMax}
          autoComplete="name"
        />
        <Campo
          id="contacto-email"
          name="email"
          type="email"
          label={t("email")}
          error={mensajeDe("email")}
          autoComplete="email"
        />
      </div>

      <Campo
        id="contacto-mensaje"
        name="message"
        label={t("message")}
        error={mensajeDe("message")}
        placeholder={t("messagePlaceholder")}
        maxLength={CONTACT_LIMITS.messageMax}
        multiline
      />

      {/*
        Señuelo anti-robots. Oculto por CSS y fuera del recorrido de teclado y
        de lectores de pantalla: una persona nunca lo ve, un robot que rellena
        todos los `input` sí. La acción descarta el envío si viene con algo.
      */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contacto-website">Website</label>
        <input
          id="contacto-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={15} aria-hidden="true" />
          {isPending ? t("submitting") : t("submit")}
        </button>

        {/*
          `role="status"` con `aria-live` para que un lector de pantalla anuncie
          el resultado: el cambio ocurre lejos del foco, que sigue en el botón.
        */}
        <p role="status" aria-live="polite" className="text-sm">
          {hasSucceeded && (
            <span className="text-foreground">{t("success")}</span>
          )}
          {hasErrored && errorDeServidor && (
            <span className="text-destructive">
              {errorDeServidor === "unavailable"
                ? t("unavailable", { email: fallbackEmail })
                : t("unexpectedError", { email: fallbackEmail })}
            </span>
          )}
          {hasErrored && !errorDeServidor && (
            <span className="text-destructive">{t("errorSummary")}</span>
          )}
        </p>
      </div>
    </form>
  );
}

function Campo({
  id,
  name,
  label,
  error,
  multiline,
  ...resto
}: {
  id: string;
  name: string;
  label: string;
  error: string | null;
  multiline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const idError = `${id}-error`;

  // `aria-describedby` solo cuando hay error: apuntar a un nodo vacío hace que
  // algunos lectores anuncien el campo como descrito por nada.
  const comunes = {
    id,
    name,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? idError : undefined,
    className: campo,
    ...resto,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea {...comunes} rows={5} className={`${campo} resize-y`} />
      ) : (
        <input {...comunes} />
      )}
      {error && (
        <span id={idError} className="text-xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
