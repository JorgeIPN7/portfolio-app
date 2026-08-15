import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { resumeData } from "@/data/resume-data";
import { siteName } from "@/lib/site";

export const alt = `${siteName} — Senior Full-Stack Engineer en fintech, proptech y blockchain`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Se genera en build, así que leer del disco no cuesta nada en producción.
  // Van los cortes estáticos, no las variables: satori no parsea variable
  // fonts y falla con "Cannot read properties of undefined".
  const playfair = await readFile(
    join(
      process.cwd(),
      "src/fonts/playfair-display/static/PlayfairDisplay-Bold.ttf",
    ),
  );
  const montserrat = await readFile(
    join(process.cwd(), "src/fonts/montserrat/static/Montserrat-Regular.ttf"),
  );

  const focus = ["Fintech", "Proptech", "Blockchain"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1120",
          padding: "72px 80px",
          fontFamily: "Montserrat",
          color: "#e2e8f0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            Curriculum
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              fontFamily: "Playfair Display",
              lineHeight: 1.02,
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontSize: 78, color: "#e2e8f0" }}>
              {resumeData.name}
            </span>
            <span style={{ fontSize: 104, color: "#ffffff" }}>
              {resumeData.lastName}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", height: 3, background: "#1e293b" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 32, color: "#e2e8f0" }}>
              Senior Full-Stack Engineer
            </span>
            <div style={{ display: "flex", gap: 14 }}>
              {focus.map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: 24,
                    color: "#94a3b8",
                    border: "1px solid #1e293b",
                    borderRadius: 999,
                    padding: "8px 22px",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfair,
          weight: 700,
          style: "normal",
        },
        {
          name: "Montserrat",
          data: montserrat,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
