"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * El movimiento del boceto (nav.js), para todo el sitio público:
 *
 *   [data-reveal]  entra al aparecer (la cascada entre hermanos la pone el CSS)
 *   .words         titulares palabra por palabra (los parte <Titular>)
 *   .divider       la costura entre secciones
 *   [data-count]   cifra que sube hasta su valor
 *   [data-px]      capa con parallax respecto al centro de la pantalla
 *   .ph-fx         la composición del encabezado sigue al puntero
 *
 * Todo lo que esconde está en sitio.css bajo @media (scripting: enabled), y con
 * movimiento reducido no se esconde nada. Vigila el DOM porque los bloques que
 * esperan datos (Suspense) llegan después de montar.
 */
export function Movimiento() {
  const ruta = usePathname();

  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const limpiezas: (() => void)[] = [];
    const vistos = new WeakSet<Element>();

    const encender = (umbral: number, alEntrar: (el: Element) => void) =>
      new IntersectionObserver(
        (entradas, io) =>
          entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            alEntrar(e.target);
            io.unobserve(e.target);
          }),
        { threshold: umbral },
      );
    const ioReveal = encender(0.16, (el) => el.classList.add("on"));
    const ioPalabras = encender(0.3, (el) => el.classList.add("on"));
    const ioDivisor = encender(0.6, (el) => el.classList.add("on"));
    const ioCifra = encender(0.5, (el) => subir(el as HTMLElement, reducido));
    limpiezas.push(() => [ioReveal, ioPalabras, ioDivisor, ioCifra].forEach((io) => io.disconnect()));

    const capas: HTMLElement[] = [];

    function revisar() {
      const una = (selector: string, io: IntersectionObserver) =>
        document.querySelectorAll(selector).forEach((el) => {
          if (vistos.has(el)) return;
          vistos.add(el);
          io.observe(el);
        });
      una("[data-reveal]", ioReveal);
      una(".words", ioPalabras);
      una(".divider", ioDivisor);
      una("[data-count]", ioCifra);
      if (!reducido)
        document.querySelectorAll<HTMLElement>("[data-px]").forEach((el) => {
          if (vistos.has(el)) return;
          vistos.add(el);
          capas.push(el);
        });
      moverCapas();
    }

    // Parallax: cada capa se desplaza según lo lejos que esté del centro.
    let pendiente = false;
    function moverCapas() {
      if (pendiente || !capas.length) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const alto = window.innerHeight;
        for (const el of capas) {
          const r = el.getBoundingClientRect();
          const desvio = (r.top + r.height / 2 - alto / 2) / alto;
          el.style.transform = `translate3d(0,${(desvio * parseFloat(el.dataset.px ?? "0")).toFixed(1)}px,0)`;
        }
        pendiente = false;
      });
    }
    window.addEventListener("scroll", moverCapas, { passive: true });
    window.addEventListener("resize", moverCapas);
    limpiezas.push(() => {
      window.removeEventListener("scroll", moverCapas);
      window.removeEventListener("resize", moverCapas);
    });

    // Se arranca con el navegador ya libre: React tiene que haber terminado de
    // hidratar la página antes de que se le toquen clases y estilos.
    const vigia = new MutationObserver(revisar);
    const arrancar = () => {
      vigia.observe(document.body, { childList: true, subtree: true });
      revisar();
    };
    // Safari no tiene requestIdleCallback.
    const ocioso = typeof requestIdleCallback === "function";
    const espera = ocioso ? requestIdleCallback(arrancar, { timeout: 600 }) : setTimeout(arrancar, 200);
    limpiezas.push(() => {
      if (ocioso) cancelIdleCallback(espera as number);
      else clearTimeout(espera);
      vigia.disconnect();
    });

    // La composición del encabezado sigue al puntero: el conjunto unos píxeles
    // y el disco algo más, para que se despeguen. Solo con puntero y en escritorio.
    const cabecera = document.querySelector<HTMLElement>(".ph-fx");
    const arte = cabecera?.querySelector<HTMLElement>(".ph-art");
    const disco = cabecera?.querySelector<HTMLElement>(".ph-disc");
    if (cabecera && arte && disco && !reducido && window.matchMedia("(min-width: 901px)").matches) {
      const mover = (x: number, y: number) => {
        arte.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        disco.style.translate = `${(x * 0.55).toFixed(1)}px ${(y * 0.55).toFixed(1)}px`;
      };
      const alMover = (e: PointerEvent) => {
        const r = cabecera.getBoundingClientRect();
        mover(((e.clientX - r.left) / r.width - 0.5) * 16, ((e.clientY - r.top) / r.height - 0.5) * 12);
      };
      const alSalir = () => mover(0, 0);
      cabecera.addEventListener("pointermove", alMover);
      cabecera.addEventListener("pointerleave", alSalir);
      limpiezas.push(() => {
        cabecera.removeEventListener("pointermove", alMover);
        cabecera.removeEventListener("pointerleave", alSalir);
      });
    }

    return () => limpiezas.forEach((f) => f());
  }, [ruta]);

  return null;
}

/**
 * La cifra sube desde 0 con frenado suave. Millares con punto, como en el
 * texto del boceto ("10.551"): Intl con es-CR los separa con espacio y con
 * "es" no agrupa las de cuatro cifras.
 */
function subir(el: HTMLElement, reducido: boolean) {
  const meta = parseFloat(el.dataset.count ?? "");
  if (Number.isNaN(meta) || reducido) return;
  const formato = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const inicio = performance.now();
  const paso = (t: number) => {
    const p = Math.min((t - inicio) / 1200, 1);
    el.textContent = formato(meta * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}
