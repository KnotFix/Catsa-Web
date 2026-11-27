"use client";

import { useEffect, useRef } from "react";
import {
  mrfArrival,
  mrfColor,
  mrfCrestAt,
  mrfEase,
  mrfLayerSpec,
  mrfMistBand,
  mrfMix,
  mrfNoiseTable,
  mrfPaintLayer,
  mrfSmooth,
  type MrfPaintOptions,
} from "./escena";

/**
 * Cielo y colinas del cierre (adaptado de "Meadow Rise Footer", 21st.dev). Se
 * dibuja en un <canvas> que cubre a su padre (la sección .cta-final): cielo
 * crema, seis colinas de caña de atrás hacia adelante y, abajo, la colina más
 * cercana se oscurece en el verde del pie, que sigue debajo sin corte.
 *
 * Al llegar a la pantalla las colinas suben entre la neblina; después la
 * neblina se mueve, la luz sigue al puntero y las colinas se acomodan con el
 * scroll. Las colinas se pintan una vez por tamaño (por píxel, repartido en
 * varios cuadros para no trabar la página) y cada cuadro solo las compone.
 * Con movimiento reducido queda la escena quieta. Los colores salen de los
 * tokens --catsa-*: no hay colores sueltos aquí.
 */
export function CieloPradera({
  arriba = "paper",
  semilla = 3,
}: {
  arriba?: "paper" | "cream";
  semilla?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const root = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const estilo = getComputedStyle(document.documentElement);
    const token = (nombre: string, respaldo: number[]) =>
      mrfColor(estilo.getPropertyValue(`--catsa-${nombre}`)) ?? respaldo;
    const sky0 = token(arriba, [253, 252, 250]);
    const cream = token("cream", [247, 243, 234]);
    const sproutBg = token("sprout-bg", [231, 240, 232]);
    const sprout = token("sprout", [159, 216, 174]);
    const green = token("green", [30, 86, 49]);
    const greenD = token("green-d", [22, 63, 36]);
    const foot = token("foot", [18, 51, 29]);
    const paper = token("paper", [253, 252, 250]);
    const sky1 = mrfMix(cream, sproutBg, 0.55);
    const hazeC = mrfMix(sky1, sprout, 0.12);
    const glowC = paper;
    const groundC = foot;
    const inkC = token("ink", [28, 27, 24]);
    // De la más lejana (casi neblina) a la más cercana (el verde del pie).
    const hillC = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => {
      const lit =
        t < 0.5
          ? mrfMix(mrfMix(sproutBg, sprout, 0.8), mrfMix(sprout, green, 0.3), t * 2)
          : mrfMix(mrfMix(sprout, green, 0.3), green, (t - 0.5) * 2);
      const sombra = mrfMix(lit, t < 0.6 ? green : greenD, 0.35 + t * 0.35);
      return [mrfMix(lit, t === 1 ? greenD : lit, 0.35), sombra];
    });
    const css = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const n = hillC.length;
    const noise = mrfNoiseTable(semilla);
    // Más bajas y más planas que en el original: el titular y los botones van en el cielo.
    const specs = hillC.map((_, i) => {
      const spec = mrfLayerSpec(i, n, semilla);
      return { ...spec, base: 0.8 + spec.q * 0.18, amp: spec.amp * 0.72 };
    });
    const MX = 40;
    const MIST = 0.5;

    let W = 1;
    let H = 1;
    let SH = 1;
    let overlap = 1;
    let cs = 1;
    type Capa = { c: HTMLCanvasElement; top: number; w: number; h: number };
    const layers: (Capa | null)[] = specs.map(() => null);
    let building = n;
    let builtFor = "";
    let mistC: HTMLCanvasElement | null = null;
    let rebuildTimer = 0;
    let revealAt: number | null = null;
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    let kT = 1;
    let k = 1;
    let visible = true;
    let seenAt: number | null = null;
    let raf = 0;
    let last = 0;

    type Trabajo = {
      i: number;
      c: HTMLCanvasElement;
      g: CanvasRenderingContext2D;
      img: ImageData;
      o: MrfPaintOptions;
      w: number;
      h: number;
      col: number;
    };
    let job: Trabajo | null = null;

    const makeMist = () => {
      const w = 320;
      const h = 64;
      const a = mrfMistBand(noise, w, h);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      if (!g) return;
      const img = g.createImageData(w, h);
      for (let i = 0; i < a.length; i++) {
        img.data[i * 4] = hazeC[0];
        img.data[i * 4 + 1] = hazeC[1];
        img.data[i * 4 + 2] = hazeC[2];
        img.data[i * 4 + 3] = a[i] * 255;
      }
      g.putImageData(img, 0, 0);
      mistC = c;
    };

    const measure = () => {
      W = Math.max(1, root.clientWidth);
      SH = Math.max(1, root.offsetHeight);
      overlap = Math.round(Math.min(190, Math.max(110, SH * 0.22)));
      H = SH - overlap;
      cs = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(W * cs);
      const ch = Math.round(SH * cs);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const sig = `${W}x${SH}`;
      if (sig !== builtFor) {
        // Mientras se pintan las nuevas se siguen dibujando las anteriores: sin parpadeo.
        window.clearTimeout(rebuildTimer);
        const first = builtFor === "";
        builtFor = sig;
        const go = () => {
          building = 0;
          job = null;
          makeMist();
          wake();
        };
        if (first) go();
        else rebuildTimer = window.setTimeout(go, 140);
      }
    };

    const startJob = (i: number): Trabajo | null => {
      const spec = specs[i];
      let minC = Infinity;
      for (let x = -MX; x <= W + MX; x += 3) minC = Math.min(minC, mrfCrestAt(spec, x, W, H));
      const top = Math.floor(minC - 4);
      const s = Math.min(window.devicePixelRatio || 1, spec.q > 0.5 ? 1.25 : 1);
      const w = Math.ceil((W + MX * 2) * s);
      const h = Math.ceil((SH - top) * s);
      const c = document.createElement("canvas");
      const g = h > 0 ? c.getContext("2d") : null;
      if (!g) {
        layers[i] = null;
        return null;
      }
      c.width = w;
      c.height = h;
      let detailTo = H + overlap * 0.8;
      if (i + 1 < n) {
        let maxC = -Infinity;
        for (let x = -MX; x <= W + MX; x += 3) maxC = Math.max(maxC, mrfCrestAt(specs[i + 1], x, W, H));
        detailTo = Math.min(detailTo, maxC + 70);
      }
      const o: MrfPaintOptions = {
        s,
        mx: MX,
        top,
        W,
        H,
        spec,
        lit: hillC[i][0],
        shadow: hillC[i][1],
        haze: hazeC,
        noise,
        detailTo,
      };
      return { i, c, g, img: g.createImageData(w, h), o, w, h, col: 0 };
    };

    const work = (budget: number) => {
      const t0 = performance.now();
      while (building < n && performance.now() - t0 < budget) {
        if (!job) job = startJob(building);
        if (!job) {
          building++;
          continue;
        }
        const next = Math.min(job.w, job.col + 40);
        mrfPaintLayer(job.img.data, job.w, job.h, job.o, job.col, next);
        job.col = next;
        if (job.col >= job.w) {
          job.g.putImageData(job.img, 0, 0);
          layers[job.i] = { c: job.c, top: job.o.top, w: job.w / job.o.s, h: job.h / job.o.s };
          job = null;
          building++;
        }
      }
    };
    const progress = () => (building >= n ? 1 : (building + (job ? job.col / job.w : 0)) / n);

    const draw = (now: number) => {
      const dt = revealAt === null ? -1 : now - revealAt;
      ctx.setTransform(cs, 0, 0, cs, 0, 0);

      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.8);
      sky.addColorStop(0, css(sky0, 1));
      sky.addColorStop(1, css(sky1, 1));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, SH);

      // El sol: una luz suave que se acerca al puntero.
      const ox = W * (0.7 + px * 0.3);
      const oy = H * 0.14 + py * H * 0.08;
      const dawn = dt < 0 ? 0 : mrfSmooth(0, 1600, dt);
      const R = Math.max(W, H) * 0.62;
      const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, R);
      glow.addColorStop(0, css(glowC, 0.85 * dawn));
      glow.addColorStop(0.35, css(glowC, 0.32 * dawn));
      glow.addColorStop(1, css(glowC, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, SH);

      // Un horizonte a lápiz se abre desde el centro mientras se pintan las colinas.
      if (dt < 1400 && (dt >= 0 || seenAt !== null)) {
        const p = dt >= 0 ? 1 : Math.min(progress(), mrfEase((now - (seenAt || now)) / 900));
        const lw = mrfEase(p) * W * 0.78;
        const la = (1 - (dt < 0 ? 0 : mrfSmooth(150, 1100, dt))) * 0.42;
        if (la > 0 && lw > 0.5) {
          const y = Math.round(H * specs[0].base);
          const lg = ctx.createLinearGradient(W / 2 - lw / 2, 0, W / 2 + lw / 2, 0);
          lg.addColorStop(0, css(inkC, 0));
          lg.addColorStop(0.5, css(inkC, la));
          lg.addColorStop(1, css(inkC, 0));
          ctx.fillStyle = lg;
          ctx.fillRect(W / 2 - lw / 2, y, lw, 1);
        }
      }

      const par = reduced ? 0 : 1 - k;
      for (let i = 0; i < (dt < 0 ? 0 : n); i++) {
        const L = layers[i];
        if (!L) continue;
        const e = dt < 0 ? 0 : mrfEase((dt - 150 - i * 120) / 1700);
        const rise = (1 - e) * H * (0.2 + 0.07 * i);
        const sy = par * (10 + i * 22);
        const lx = -px * (2 + i * 5);
        const ly = -py * (1 + i * 2);
        ctx.drawImage(L.c, -MX + lx, L.top + rise + sy + ly, L.w, L.h);
        if (mistC && (i === 1 || i === 3) && i + 1 < n) {
          const bw = W * 1.7;
          const bh = H * (i === 1 ? 0.26 : 0.2);
          const speed = i === 1 ? 7 : 11;
          const off = reduced ? 0 : ((now * speed) / 1000) % bw;
          const y = H * specs[i + 1].base - bh * 0.62 + rise * 0.6 + sy;
          ctx.globalAlpha = MIST * (i === 1 ? 0.9 : 0.65) * (dt < 0 ? 0 : mrfSmooth(900, 2600, dt));
          ctx.drawImage(mistC, -off + lx * 1.4, y, bw, bh);
          ctx.drawImage(mistC, bw - off + lx * 1.4, y, bw, bh);
          ctx.globalAlpha = 1;
        }
      }

      ctx.globalCompositeOperation = "soft-light";
      const pool = ctx.createRadialGradient(ox, H * 0.7, 0, ox, H * 0.7, W * 0.5);
      pool.addColorStop(0, css(glowC, 0.45 * dawn));
      pool.addColorStop(1, css(glowC, 0));
      ctx.fillStyle = pool;
      ctx.fillRect(0, 0, W, SH);
      ctx.globalCompositeOperation = "source-over";

      const fog = dt < 0 ? 1 : 1 - mrfSmooth(100, 2100, dt);
      if (fog > 0) {
        const f = ctx.createLinearGradient(0, 0, 0, SH);
        f.addColorStop(0, css(sky0, fog));
        f.addColorStop(1, css(sky1, fog));
        ctx.fillStyle = f;
        ctx.fillRect(0, 0, W, SH);
      }

      // La colina más cercana se oscurece en el verde del pie.
      const g = ctx.createLinearGradient(0, H - overlap * 0.05, 0, SH);
      g.addColorStop(0, css(groundC, 0));
      g.addColorStop(0.55, css(groundC, 0.72));
      g.addColorStop(1, css(groundC, 1));
      ctx.fillStyle = g;
      ctx.fillRect(0, H - overlap * 0.05, W, SH - H + overlap * 0.05 + 1);
    };

    const tick = (now: number) => {
      raf = 0;
      const busy = building < n;
      if (busy) work(revealAt === null ? 14 : visible ? 8 : 6);
      if (revealAt === null && seenAt !== null && building >= n && (reduced || now - seenAt > 650)) {
        revealAt = reduced ? -1e9 : now;
      }
      if (!visible) {
        if (busy) raf = requestAnimationFrame(tick);
        return;
      }
      if (!reduced) {
        const r = root.getBoundingClientRect();
        kT = mrfArrival(r.top, r.height, window.innerHeight);
      } else kT = 1;
      px += ((reduced ? 0 : tx) - px) * 0.06;
      py += ((reduced ? 0 : ty) - py) * 0.06;
      k += (kT - k) * 0.1;
      const easing =
        Math.abs((reduced ? 0 : tx) - px) > 0.001 ||
        Math.abs((reduced ? 0 : ty) - py) > 0.001 ||
        Math.abs(kT - k) > 0.001;
      const intro = (revealAt === null && seenAt !== null) || (revealAt !== null && now - revealAt < 3000);
      const ambient = !reduced;
      if (busy || intro || easing || now - last > 33) {
        draw(now);
        last = now;
      }
      if (busy || intro || easing || ambient) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf && (visible || building < n)) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      tx = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / Math.max(1, r.width) - 0.5));
      ty = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / Math.max(1, r.height) - 0.5));
      wake();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      wake();
    };

    measure();
    draw(performance.now());
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", wake, { passive: true });
    const ro = new ResizeObserver(() => {
      measure();
      draw(performance.now());
      wake();
    });
    ro.observe(root);
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        visible = e.isIntersecting;
        if (e.isIntersecting && e.intersectionRatio >= 0.12 && seenAt === null) seenAt = performance.now();
        if (visible) wake();
      },
      { threshold: [0, 0.12, 0.3] },
    );
    io.observe(root);
    wake();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rebuildTimer);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", wake);
    };
  }, [arriba, semilla]);

  return <canvas ref={ref} className="pradera" aria-hidden />;
}
