"use client";

import { animate, type AnimationPlaybackControls } from "motion";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef } from "react";

/**
 * Cuántas veces más rápido va el rebobinado que la reproducción normal. El
 * bucle manual que había antes restaba 0,04 s por fotograma a 60 fps, es decir
 * 2,4x: se conserva esa sensación.
 */
const REWIND_SPEED = 3;

/** Margen sobre el final: algunos códecs no tienen fotograma exacto en `duration`. */
const END_MARGIN = 0.05;

/**
 * Retrato que reacciona al cambio de tema: hacia delante al pasar a oscuro,
 * rebobinado al volver a claro.
 *
 * El archivo pesa varios MB. Con `preload="auto"` competía con la carga de la
 * página y con `preload="none"` a secas llegaba tarde al primer clic, así que
 * el elemento arranca sin precarga y el vídeo se pide aparte en cuanto el
 * navegador queda ocioso. Si el clic llega antes, se espera a que haya
 * fotogramas en vez de perder la reproducción.
 *
 * `prefers-reduced-motion` no se consulta a propósito: esa preferencia existe
 * para el movimiento que aparece sin pedirlo, y este vídeo es la respuesta
 * directa a un clic. Saltárselo eliminaría la función en vez de suavizarla.
 */
export function ProfileVideo({ poster }: { poster: string }) {
  const { resolvedTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  // next-themes no conoce el tema hasta que monta: `undefined` distingue el
  // primer valor (posición de reposo) de un cambio real (animación).
  const previousThemeRef = useRef<string | undefined>(undefined);
  const rewindRef = useRef<AnimationPlaybackControls | null>(null);

  const stopRewind = useCallback(() => {
    rewindRef.current?.stop();
    rewindRef.current = null;
  }, []);

  const rewind = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    stopRewind();

    const desde = video.currentTime;
    if (desde <= 0) return;

    // La duración se calcula sobre lo que queda por recorrer, no fija: con un
    // valor constante, rebobinar 5 segundos de vídeo en medio segundo hacía que
    // el cambio pasara desapercibido. `linear` porque un rebobinado con
    // aceleración y frenado no se lee como tal.
    rewindRef.current = animate(desde, 0, {
      duration: desde / REWIND_SPEED,
      ease: "linear",
      onUpdate: (segundo) => {
        video.currentTime = Math.max(0, segundo);
      },
      onComplete: () => {
        rewindRef.current = null;
      },
    });
  }, [stopRewind]);

  // Precarga diferida: la descarga empieza cuando la página ya está servida.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const warmUp = () => {
      if (cancelled) return;
      video.preload = "auto";
      video.load();
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warmUp, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const id = window.setTimeout(warmUp, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  // Un solo efecto para las dos cosas, a propósito. Cuando la posición de
  // reposo vivía en su propio efecto declarado antes que este, React lo
  // ejecutaba primero en el mismo commit: ponía `currentTime` a 0 justo antes
  // de que arrancara el rebobinado, que entonces animaba de 0 a 0 y no se veía
  // nada. Aquí no hay carrera posible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedTheme) return;

    const anterior = previousThemeRef.current;
    previousThemeRef.current = resolvedTheme;

    // Primer tema conocido: es la posición de reposo, no una transición. En
    // oscuro el retrato corresponde al último fotograma; el póster ya muestra
    // ese mismo fotograma, así que el salto no se ve.
    if (anterior === undefined) {
      const settle = () => {
        // Si mientras cargaban los metadatos ya hubo un cambio de tema, manda
        // la animación: este colocado llega tarde y hay que descartarlo.
        if (previousThemeRef.current !== resolvedTheme) return;
        if (!Number.isFinite(video.duration)) return;
        video.currentTime =
          resolvedTheme === "dark"
            ? Math.max(0, video.duration - END_MARGIN)
            : 0;
      };

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        settle();
        return;
      }
      // Sin cleanup ni `once` a secas: el listener debe sobrevivir a que el
      // efecto se re-ejecute, y `settle` ya se descarta solo si llega tarde.
      video.addEventListener("loadedmetadata", settle, { once: true });
      return;
    }

    if (anterior === resolvedTheme) return;

    // Si la precarga aún no ha traído nada, se fuerza aquí.
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      video.preload = "auto";
      video.load();
    }

    const run = () => {
      if (resolvedTheme === "dark") {
        stopRewind();
        video.currentTime = 0;
        // Puede rechazarse por ahorro de batería; el póster se queda.
        void video.play().catch(() => {});
      } else {
        video.pause();
        rewind();
      }
    };

    // `HAVE_CURRENT_DATA` garantiza que hay fotograma para pintar; con menos,
    // `play()` se quedaría esperando y el cambio pasaría desapercibido.
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      run();
      return;
    }

    video.addEventListener("canplay", run, { once: true });
    return () => video.removeEventListener("canplay", run);
  }, [resolvedTheme, rewind, stopRewind]);

  // Corta el rebobinado pendiente al desmontar.
  useEffect(() => stopRewind, [stopRewind]);

  return (
    <div className="relative h-56 w-56 overflow-hidden rounded-full border-2 border-border lg:h-64 lg:w-64">
      <video
        ref={videoRef}
        src="/profile-video.mp4"
        muted
        playsInline
        preload="none"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
