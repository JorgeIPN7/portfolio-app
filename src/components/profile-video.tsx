"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

/** Salto por fotograma al rebobinar. Más alto = más rápido y más entrecortado. */
const REVERSE_STEP_SECONDS = 0.04;

/**
 * Retrato que reacciona al cambio de tema: hacia delante al pasar a oscuro,
 * rebobinado al volver a claro.
 *
 * Sobre el peso: con `preload="auto"` el vídeo competía con la carga de la
 * página, y con `preload="none"` a secas llegaba tarde al primer clic. El
 * elemento arranca sin precarga y el archivo se pide aparte, en cuanto el
 * navegador queda ocioso: fuera de la ruta crítica, pero listo antes de que
 * nadie toque el botón. Si aun así el clic llega primero, se espera a que
 * haya fotogramas en vez de perder la reproducción.
 *
 * Sobre `prefers-reduced-motion`: aquí no se consulta a propósito. Esa
 * preferencia existe para el movimiento que aparece sin pedirlo; este vídeo
 * es la respuesta directa a un clic, y saltárselo elimina la función en vez
 * de suavizarla.
 */
export function ProfileVideo({ poster }: { poster: string }) {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousThemeRef = useRef(theme);
  const initialThemeRef = useRef(theme);
  const rafRef = useRef<number | null>(null);

  const stopReverse = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const playReverse = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    stopReverse();

    const step = () => {
      if (video.currentTime <= REVERSE_STEP_SECONDS) {
        video.currentTime = 0;
        rafRef.current = null;
        return;
      }
      video.currentTime = Math.max(0, video.currentTime - REVERSE_STEP_SECONDS);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [stopReverse]);

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

  // Posición de reposo al cargar. En oscuro el retrato corresponde al último
  // fotograma, así que el vídeo se coloca ahí en cuanto hay metadatos; el
  // póster ya muestra ese mismo fotograma, así que el salto no se ve.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || initialThemeRef.current !== "dark") return;

    const settle = () => {
      // Si ya hubo un cambio de tema, manda la animación.
      if (previousThemeRef.current !== initialThemeRef.current) return;
      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      settle();
      return;
    }

    video.addEventListener("loadedmetadata", settle, { once: true });
    return () => video.removeEventListener("loadedmetadata", settle);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || previousThemeRef.current === theme) return;
    previousThemeRef.current = theme;

    // Si la precarga aún no ha traído nada, se fuerza aquí.
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      video.preload = "auto";
      video.load();
    }

    const run = () => {
      if (theme === "dark") {
        stopReverse();
        video.currentTime = 0;
        // Puede rechazarse por ahorro de batería; el póster se queda.
        void video.play().catch(() => {});
      } else {
        video.pause();
        playReverse();
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
  }, [theme, playReverse, stopReverse]);

  // Corta la animación pendiente al desmontar.
  useEffect(() => stopReverse, [stopReverse]);

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
