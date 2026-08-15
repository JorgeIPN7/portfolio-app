import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand-icons";

describe("iconos de marca", () => {
  it.each([
    ["GithubIcon", GithubIcon],
    ["LinkedinIcon", LinkedinIcon],
  ])("%s respeta el tamaño y hereda el color", (_nombre, Icono) => {
    const { container } = render(<Icono size={16} />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    // `currentColor` es lo que permite que sigan al tema sin CSS extra.
    expect(svg).toHaveAttribute("fill", "currentColor");
  });

  it("quedan fuera del árbol de accesibilidad: son decorativos junto al texto", () => {
    const { container } = render(<GithubIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("usa 24 por defecto, el mismo tamaño que los iconos de lucide", () => {
    const { container } = render(<LinkedinIcon />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "24");
  });
});
