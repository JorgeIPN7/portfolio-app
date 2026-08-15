import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function renderConProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

const botonTema = () =>
  screen.getByRole("button", { name: /tema claro y oscuro/i });

/**
 * Se prueba el comportamiento, no next-themes. Lo que importa es que la
 * configuración de este sitio siga cumpliendo lo pedido: abrir en oscuro,
 * ignorar el esquema del sistema y recordar la elección.
 */
describe("tema", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("abre en oscuro cuando no hay nada guardado", async () => {
    renderConProvider();
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
  });

  it("respeta la elección guardada por encima del valor por defecto", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    renderConProvider();
    await waitFor(() =>
      expect(document.documentElement).not.toHaveClass("dark"),
    );
  });

  it("al pulsar pasa a claro y lo guarda", async () => {
    renderConProvider();
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));

    fireEvent.click(botonTema());

    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass("dark");
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    });
  });

  it("un segundo clic vuelve a oscuro", async () => {
    renderConProvider();
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));

    fireEvent.click(botonTema());
    await waitFor(() =>
      expect(document.documentElement).not.toHaveClass("dark"),
    );

    fireEvent.click(botonTema());
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    });
  });

  it("guarda bajo la clave que comparte con el resto del proyecto", async () => {
    renderConProvider();
    fireEvent.click(botonTema());
    await waitFor(() =>
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).not.toBeNull(),
    );
    // Si next-themes cambiara de clave por defecto, esto lo detecta.
    expect(THEME_STORAGE_KEY).toBe("theme");
  });
});

describe("ThemeToggle", () => {
  it("tiene un nombre accesible y no anuncia los iconos", () => {
    renderConProvider();
    expect(botonTema()).toBeInTheDocument();
    // Ambos iconos se renderizan siempre: los alterna CSS según la clase del
    // <html>, para que el botón coincida con el tema sin esperar a React.
    const iconos = botonTema().querySelectorAll("svg");
    expect(iconos).toHaveLength(2);
    for (const icono of iconos) {
      expect(icono).toHaveAttribute("aria-hidden", "true");
    }
  });
});
