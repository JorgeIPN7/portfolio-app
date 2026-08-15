"use server";

import { headers } from "next/headers";
import { returnServerError } from "next-safe-action";
import { Resend } from "resend";
import { resumeIdentity } from "@/data/resume-data";
import { env } from "@/env";
import { contactSchema } from "@/lib/contact-schema";
import { dentroDelLimite } from "@/lib/rate-limit";
import { actionClient } from "@/lib/safe-action";

/** Tres mensajes por IP y hora. Un candidato honrado no necesita el cuarto. */
const MAXIMO_POR_VENTANA = 3;
const VENTANA_MS = 60 * 60 * 1000;

/**
 * IP del visitante. Detrás del proxy de Vercel la conexión sale de su red, así
 * que la real va en `x-forwarded-for`, y la primera de la lista es la del
 * cliente. Es falsificable: sirve para frenar a un robot torpe, no para
 * identificar a nadie.
 */
async function ipDeLaPeticion(): Promise<string> {
  const cabeceras = await headers();
  const reenviada = cabeceras.get("x-forwarded-for");
  return reenviada?.split(",")[0]?.trim() ?? "desconocida";
}

export const sendContactMessage = actionClient
  .inputSchema(contactSchema)
  .action(
    async ({ parsedInput: { name, email, message, website, locale } }) => {
      // Señuelo relleno: era un robot. Se le responde que todo fue bien y no se
      // envía nada. Un error le diría qué campo evitar la próxima vez.
      if (website) return { enviado: true };

      // El límite solo se aplica en producción. En desarrollo no hay spam del que
      // defenderse —tampoco se envía ningún correo— y sí estorba: las pruebas E2E
      // envían varias veces contra el mismo servidor, cuyo contador sobrevive
      // entre ejecuciones. La función en sí tiene sus propias pruebas unitarias.
      const aplicarLimite = process.env.NODE_ENV === "production";
      if (
        aplicarLimite &&
        !dentroDelLimite(await ipDeLaPeticion(), MAXIMO_POR_VENTANA, VENTANA_MS)
      ) {
        // Se trata como "no disponible" a propósito: el mensaje que verá invita a
        // escribir al correo directo, que es exactamente lo que debe hacer una
        // persona real que haya agotado el cupo sin querer.
        returnServerError("unavailable" as const);
      }

      const destinatario = env.CONTACT_TO_EMAIL ?? resumeIdentity.contact.email;
      const asunto =
        locale === "es"
          ? `CV · nuevo mensaje de ${name}`
          : `CV · new message from ${name}`;
      const cuerpo = [
        `${name} <${email}>`,
        locale === "es" ? "Idioma: español" : "Language: English",
        "",
        message,
      ].join("\n");

      if (!env.RESEND_API_KEY) {
        // En desarrollo se enseña el mensaje por consola para poder probar el
        // formulario entero sin dar de alta nada. En producción no hay nada que
        // hacer salvo avisar: fingir un envío perdería el mensaje en silencio.
        if (process.env.NODE_ENV === "development") {
          console.info(
            `[contacto] Sin RESEND_API_KEY. Mensaje no enviado:\n${cuerpo}`,
          );
          return { enviado: true };
        }
        returnServerError("unavailable" as const);
      }

      const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
        from: env.CONTACT_FROM_EMAIL,
        to: destinatario,
        // Responder al aviso escribe a quien rellenó el formulario, no al buzón
        // técnico de Resend.
        replyTo: email,
        subject: asunto,
        text: cuerpo,
      });

      // El SDK de Resend devuelve el fallo en `error` en vez de lanzarlo, así que
      // sin esta comprobación un envío rechazado se contaría como enviado.
      if (error) throw new Error(`Resend rechazó el envío: ${error.message}`);

      return { enviado: true };
    },
  );
