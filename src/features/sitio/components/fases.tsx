"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Las siete fases de Cómo trabajamos. En escritorio, la ilustración queda fija
 * a la izquierda y cambia con la fase que cruza el centro de la pantalla; un
 * índice lateral aparece mientras se recorre la sección. En móvil cada fase
 * lleva su propia insignia.
 */
export function Fases() {
  const [activa, setActiva] = useState(0);
  const [indiceVisible, setIndiceVisible] = useState(false);
  const seccion = useRef<HTMLElement>(null);

  useEffect(() => {
    const raiz = seccion.current;
    if (!raiz) return;
    const pasos = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) setActiva(Number((e.target as HTMLElement).dataset.i));
        }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    raiz.querySelectorAll(".fase-step").forEach((el) => pasos.observe(el));
    const dentro = new IntersectionObserver(
      ([e]) => setIndiceVisible(e.isIntersecting && e.intersectionRatio > 0.1),
      { threshold: [0, 0.1, 0.5] },
    );
    dentro.observe(raiz);
    return () => {
      pasos.disconnect();
      dentro.disconnect();
    };
  }, []);

  const numero = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <>
      <nav className={cn("fase-idx", indiceVisible && "show")} aria-label="Fases">
        {FASES.map((f, i) => (
          <a
            key={f.titulo}
            href={`#fase-${i + 1}`}
            className={cn(i === activa && "on")}
            aria-label={f.titulo}
          >
            {numero(i)}
            <span className="ln" />
          </a>
        ))}
      </nav>
      <section className="phases" ref={seccion}>
        <div className="grid">
          <div>
            <div className="fase-visual" aria-hidden>
              <div className="stage">
                <div className="ghost-num">{numero(activa)}</div>
                <div className="ring">
                  {FASES.map((f, i) => (
                    <div key={f.titulo} className={cn("ic", i === activa && "on")}>
                      <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {f.ilustracion}
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="vlabel">Fase {numero(activa)}</div>
                <div className="vname">{FASES[activa].titulo}</div>
              </div>
            </div>
          </div>
          <div className="fase-steps">
            {FASES.map((f, i) => (
              <div key={f.titulo} className="fase-step" id={`fase-${i + 1}`} data-i={i}>
                <div className="fase-badge" aria-hidden>
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.insignia}
                  </svg>
                </div>
                <div className="st-num">FASE {numero(i)}</div>
                <h3>{f.titulo}</h3>
                <p>{f.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const FASES = [
  {
    titulo: "Cosecha",
    texto:
      "Todo empieza en el cañal. De diciembre a principios de abril cosechamos la caña, el 95 % con máquinas que la cortan en trozos y la limpian. Al llegar al ingenio se pesa y se muestrea con un Core Sampler para medir su azúcar y sus impurezas.",
    ilustracion: (
      <>
        <path d="M50 92V34" />
        <line x1="42" y1="74" x2="58" y2="74" />
        <line x1="42" y1="60" x2="58" y2="60" />
        <line x1="42" y1="46" x2="58" y2="46" />
        <path className="amber" d="M50 44C40 34 28 38 28 24c14 2 22 6 22 20Z" />
        <path d="M50 38C60 26 72 30 72 16c-14 2-22 6-22 22Z" />
      </>
    ),
    insignia: (
      <>
        <path d="M50 92V34" />
        <path d="M50 38C60 26 72 30 72 16c-14 2-22 6-22 22Z" />
      </>
    ),
  },
  {
    titulo: "Molienda",
    texto:
      "Picadoras y una desfibradora abren la caña y un tándem de seis molinos extrae su jugo: 7.500 toneladas de caña al día. El bagazo que queda alimenta las calderas que dan vapor y energía a toda la planta.",
    ilustracion: (
      <>
        <circle cx="50" cy="50" r="17" />
        <circle cx="50" cy="50" r="6" />
        <line x1="50" y1="17" x2="50" y2="30" />
        <line x1="50" y1="70" x2="50" y2="83" />
        <line x1="17" y1="50" x2="30" y2="50" />
        <line x1="70" y1="50" x2="83" y2="50" />
        <line x1="27" y1="27" x2="36" y2="36" />
        <line x1="64" y1="64" x2="73" y2="73" />
        <line x1="27" y1="73" x2="36" y2="64" />
        <line x1="64" y1="36" x2="73" y2="27" />
      </>
    ),
    insignia: (
      <>
        <circle cx="50" cy="50" r="16" />
        <circle cx="50" cy="50" r="6" />
      </>
    ),
  },
  {
    titulo: "Clarificación y evaporación",
    texto:
      "El jugo se sulfita, se alcaliza con cal y se calienta para separar las impurezas en los clarificadores. Luego una línea de evaporadores de quíntuple efecto lo concentra de 15 a 60 °Brix: la meladura.",
    ilustracion: (
      <>
        <ellipse cx="50" cy="26" rx="20" ry="8" />
        <path d="M30 26v34a20 10 0 0 0 40 0V26" />
        <path className="amber" d="M40 46h20M40 56h20" />
        <line x1="40" y1="78" x2="40" y2="86" />
        <line x1="60" y1="78" x2="60" y2="86" />
      </>
    ),
    insignia: (
      <>
        <ellipse cx="50" cy="28" rx="18" ry="7" />
        <path d="M32 28v32a18 9 0 0 0 36 0V28" />
      </>
    ),
  },
  {
    titulo: "Cristalización",
    texto:
      "La meladura se cocina en tachos hasta formar los cristales, con un esquema de doble magma y tres masas cocidas. Centrífugas a 1.200 rpm separan el azúcar de la miel, y la última miel agotada es la melaza.",
    ilustracion: (
      <>
        <path d="M50 18 66 40 50 82 34 40Z" />
        <path d="M34 40h32" />
        <path d="M50 18v22" />
        <path className="amber" d="M24 62l7 9M76 62l-7 9" />
      </>
    ),
    insignia: (
      <>
        <path d="M50 22 64 42 50 80 36 42Z" />
        <path d="M36 42h28" />
      </>
    ),
  },
  {
    titulo: "Refinación",
    texto:
      "En la refinería, el azúcar blanco se disuelve, se decolora con carbón activado y pasa por doble filtración antes de cristalizar de nuevo. Así se obtienen los refinos, hasta el de 35 UI de color.",
    ilustracion: (
      <>
        <path d="M26 26h48L55 52v20l-10 6V52Z" />
        <path className="amber" d="M45 84h10" />
      </>
    ),
    insignia: <path d="M28 30h44L54 54v18l-8 5V54Z" />,
  },
  {
    titulo: "Destilería",
    texto:
      "La melaza fermenta con levadura en 20 fermentadores de 250.000 litros y se destila en columnas. Un sistema con etilenglicol deshidrata el alcohol: así producimos alcohol etílico neutro y anhidro.",
    ilustracion: (
      <>
        <path d="M42 20h16M45 20v22L29 76a5 5 0 0 0 4 8h34a5 5 0 0 0 4-8L55 42V20" />
        <path className="amber" d="M37 64h26" />
      </>
    ),
    insignia: <path d="M43 24h14M46 24v20L32 74a4 4 0 0 0 4 6h28a4 4 0 0 0 4-6L54 44V24" />,
  },
  {
    titulo: "Envase y despacho",
    texto:
      "El azúcar seco se empaca en sacos de 50 kg o big bags de 1.000 kg y se despacha a LAICA, que lo comercializa. El crudo sale a granel desde el silo; el alcohol y la miel, en cisternas.",
    ilustracion: (
      <>
        <path d="M34 42c0-6 6-10 16-10s16 4 16 10l4 38a5 5 0 0 1-5 5H35a5 5 0 0 1-5-5Z" />
        <path d="M42 32c0-7 4-10 8-10s8 3 8 10" />
        <path className="amber" d="M42 58h16" />
      </>
    ),
    insignia: (
      <>
        <path d="M35 44c0-6 6-10 15-10s15 4 15 10l4 34a4 4 0 0 1-4 5H35a4 4 0 0 1-4-5Z" />
        <path d="M43 34c0-6 3-9 7-9s7 3 7 9" />
      </>
    ),
  },
];
