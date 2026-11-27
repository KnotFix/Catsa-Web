"use client";

import { useEffect, useMemo, useRef } from "react";
import { mrfBotany } from "./escena";

/**
 * Flores de línea, muy tenues, en el fondo del pie. Se dibujan solas cuando el
 * pie llega a la pantalla y después se mecen. Con movimiento reducido quedan
 * quietas y dibujadas (sitio.css).
 */
export function Flores({ semilla = 3 }: { semilla?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const flores = useMemo(() => mrfBotany(semilla, 9), [semilla]);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        svg.classList.add("on");
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} className="flores" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax meet" aria-hidden>
      {flores.map((f, i) => (
        <g
          key={i}
          className="flor"
          style={{ transformOrigin: `${f.x}px 420px`, "--sd": i * 1.7 } as React.CSSProperties}
        >
          <path
            d={f.stem}
            pathLength={1}
            style={{ "--d": `${200 + f.order * 900}ms` } as React.CSSProperties}
          />
          {f.parts.map((d, j) => (
            <path
              key={j}
              d={d}
              pathLength={1}
              style={{ "--d": `${900 + f.order * 900 + j * 90}ms` } as React.CSSProperties}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
