import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Expone el valor del contexto para poder afirmarlo. */
function Sonda() {
  const { theme } = useTheme();
  return <span data-testid="tema">{theme}</span>;
}

function renderConProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
      <Sonda />
    </ThemeProvider>,
  );
}

const botonTema = () =>
  screen.getByRole("button", { name: /tema claro y oscuro/i });

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("useTheme falla fuera del provider en vez de devolver un contexto vacío", () => {
    // React vuelca el error en consola aunque la prueba lo capture.
    const silencio = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Sonda />)).toThrow(/ThemeProvider/);
    silencio.mockRestore();
  });

  it("toma el estado inicial del DOM, que es lo que deja el script antiparpadeo", () => {
    document.documentElement.classList.add("dark");
    render(
      <ThemeProvider>
        <Sonda />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("tema")).toHaveTextContent("dark");
  });

  it("al pulsar pasa a oscuro, aplica la clase y guarda la elección", () => {
    renderConProvider();
    expect(document.documentElement).not.toHaveClass("dark");

    fireEvent.click(botonTema());

    expect(screen.getByTestId("tema")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("un segundo clic vuelve a claro y también lo guarda", () => {
    renderConProvider();
    fireEvent.click(botonTema());
    fireEvent.click(botonTema());

    expect(screen.getByTestId("tema")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
    // Se guarda "light" explícitamente: sin eso, la recarga volvería al
    // oscuro por defecto y la elección se perdería.
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("sigue funcionando si localStorage está bloqueado", () => {
    const fallo = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("modo privado");
      });

    renderConProvider();
    expect(() => fireEvent.click(botonTema())).not.toThrow();
    // El tema cambia igual; solo no sobrevive a la recarga.
    expect(document.documentElement).toHaveClass("dark");

    fallo.mockRestore();
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

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
