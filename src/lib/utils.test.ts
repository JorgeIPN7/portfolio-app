import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("une clases sueltas", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("descarta los valores falsy que produce el renderizado condicional", () => {
    expect(cn("flex", false && "hidden", undefined, null, "gap-2")).toBe(
      "flex gap-2",
    );
  });

  it("resuelve los conflictos de Tailwind quedándose con la última", () => {
    // Es la razón de existir de twMerge. Sin él quedarían las dos clases y
    // ganaría la que el CSS declare después, no la que pide quien llama.
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm text-muted-foreground", "text-foreground")).toBe(
      "text-sm text-foreground",
    );
  });

  it("acepta arrays y objetos, como los usan los componentes de shadcn", () => {
    expect(cn(["flex", { hidden: false, "gap-2": true }])).toBe("flex gap-2");
  });
});
