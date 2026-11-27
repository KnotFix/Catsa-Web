/**
 * Motor de la pradera del cierre: colinas pintadas por píxel, neblina y flores
 * de línea. Viene del componente "Meadow Rise Footer" (21st.dev, @kedhareswer),
 * sin DOM ni React para poder probarlo y reusarlo. Se conservan los nombres del
 * original (mrf…) para poder compararlo con él.
 */

/** mulberry32: pequeño, rápido y determinista. Devuelve números en [0, 1). */
export function mrfRng(seed: number) {
  let a = (seed | 0) ^ 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Color CSS ("#rrggbb", "#rgb" o "rgb(r, g, b)") a [r, g, b]; null si no se entiende. */
export function mrfColor(c: string) {
  const v = (c || "").trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(v);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
}

/** Mezcla lineal de dos colores [r, g, b]. */
export function mrfMix(a: number[], b: number[], t: number) {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
}

export function mrfClamp(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

export function mrfSmooth(e0: number, e1: number, x: number) {
  const t = mrfClamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** Salida cuártica: arranca rápido y aterriza suave. */
export function mrfEase(t: number) {
  const c = mrfClamp(t);
  return 1 - (1 - c) * (1 - c) * (1 - c) * (1 - c);
}

/** Ruido de valor de 256 × 256 que se repite en ambos sentidos. Valores en [0, 1). */
export function mrfNoiseTable(seed: number) {
  const rnd = mrfRng(seed * 7919 + 17);
  const G = 32;
  const lat = new Float32Array(G * G);
  for (let i = 0; i < lat.length; i++) lat[i] = rnd();
  const out = new Float32Array(65536);
  for (let y = 0; y < 256; y++) {
    const gy = y / 8;
    const y0 = Math.floor(gy);
    const fy = gy - y0;
    const sy = fy * fy * (3 - 2 * fy);
    const r0 = (y0 % G) * G;
    const r1 = ((y0 + 1) % G) * G;
    for (let x = 0; x < 256; x++) {
      const gx = x / 8;
      const x0 = Math.floor(gx);
      const fx = gx - x0;
      const sx = fx * fx * (3 - 2 * fx);
      const c0 = x0 % G;
      const c1 = (x0 + 1) % G;
      const a = lat[r0 + c0] + (lat[r0 + c1] - lat[r0 + c0]) * sx;
      const b = lat[r1 + c0] + (lat[r1 + c1] - lat[r1 + c0]) * sx;
      out[(y << 8) | x] = a + (b - a) * sy;
    }
  }
  return out;
}

/** Lectura bilineal de la tabla de ruido, con vuelta. */
export function mrfSample(t: Float32Array, x: number, y: number) {
  const x0 = x | 0;
  const y0 = y | 0;
  const fx = x - x0;
  const fy = y - y0;
  const xa = x0 & 255;
  const xb = (x0 + 1) & 255;
  const ya = (y0 & 255) << 8;
  const yb = ((y0 + 1) & 255) << 8;
  const a = t[ya | xa] + (t[ya | xb] - t[ya | xa]) * fx;
  const b = t[yb | xa] + (t[yb | xb] - t[yb | xa]) * fx;
  return a + (b - a) * fy;
}

export interface MrfDome {
  c: number;
  w: number;
  h: number;
}

export interface MrfLayerSpec {
  /** 0 la colina más lejana, 1 la más cercana. */
  q: number;
  /** Base de la cresta, como fracción del alto del cielo. */
  base: number;
  amp: number;
  domes: MrfDome[];
  waves: { f: number; p: number; a: number }[];
  depth: number;
  haze: number;
}

/** Forma de la colina i de n: unión suave de lomas sobre una ondulación lenta. */
export function mrfLayerSpec(i: number, n: number, seed: number): MrfLayerSpec {
  const q = n > 1 ? i / (n - 1) : 1;
  const rnd = mrfRng(seed * 977 + i * 131 + 7);
  const count = q > 0.9 ? 2 : 3 + Math.floor(rnd() * 1.6);
  const domes: MrfDome[] = [];
  const span = 2.8 / count;
  const lean = i % 2 ? 1 : -1;
  for (let k = 0; k < count; k++) {
    const c = -1.4 + (k + 0.15 + rnd() * 0.7) * span;
    domes.push({
      c,
      w: (0.3 + rnd() * 0.32) * (1 + q * 0.7),
      h: 0.42 + rnd() * 0.42 + 0.16 * Math.max(0, Math.min(1, 0.5 + c * lean * 0.6)),
    });
  }
  return {
    q,
    base: 0.68 + q * 0.29,
    amp: 0.27 - q * 0.17,
    domes,
    waves: [
      { f: 1.6 + rnd() * 1.4, p: rnd() * 6.2832, a: 0.07 },
      { f: 4.5 + rnd() * 3, p: rnd() * 6.2832, a: 0.025 },
    ],
    depth: 0.16 + q * 0.3,
    haze: 0.03 + 0.5 * Math.pow(1 - q, 1.7),
  };
}

/** Alto de la cresta (px CSS desde arriba) en x, para una escena W de ancho y H de cielo. */
export function mrfCrestAt(spec: MrfLayerSpec, x: number, W: number, H: number) {
  const u = (x - W / 2) / 1000;
  let sum = 0;
  for (let k = 0; k < spec.domes.length; k++) {
    const d = spec.domes[k];
    const z = (u - d.c) / d.w;
    sum += Math.exp(14 * d.h * Math.exp(-z * z));
  }
  const top = Math.log(sum) / 14;
  let wave = 0;
  for (let k = 0; k < spec.waves.length; k++) {
    const o = spec.waves[k];
    wave += o.a * Math.sin(u * o.f * 6.2832 + o.p);
  }
  return H * (spec.base - spec.amp * (top + wave));
}

/** 0–1: qué tan cerca está x del pliegue donde se juntan dos lomas. */
export function mrfSeamAt(spec: MrfLayerSpec, x: number, W: number) {
  const u = (x - W / 2) / 1000;
  let a = 0;
  let b = 0;
  for (let k = 0; k < spec.domes.length; k++) {
    const d = spec.domes[k];
    const z = (u - d.c) / d.w;
    const v = d.h * Math.exp(-z * z);
    if (v > a) {
      b = a;
      a = v;
    } else if (v > b) b = v;
  }
  const g = (a - b) / 0.07;
  return b > 0.12 ? Math.exp(-g * g) : 0;
}

const MRF_L = (() => {
  const v = [0.42, 0.78, 0.46];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

/** Luz sobre la cara de la colina, 0–1, según la pendiente m y la profundidad t. */
export function mrfShade(m: number, t: number) {
  const f = Math.pow(mrfClamp(t), 0.6);
  const nx = m * 2.4 * (1 - f);
  const ny = 1 - f + 0.18;
  const nz = 0.22 + f * 1.15;
  const l = Math.hypot(nx, ny, nz);
  const d = (nx * MRF_L[0] + ny * MRF_L[1] + nz * MRF_L[2]) / l;
  return mrfClamp(0.12 + 0.88 * d);
}

export interface MrfPaintOptions {
  s: number;
  mx: number;
  top: number;
  detailTo: number;
  W: number;
  H: number;
  spec: MrfLayerSpec;
  lit: number[];
  shadow: number[];
  haze: number[];
  noise: Float32Array;
}

const MRF_STEPS = 64;

/** Pinta las columnas c0…c1 de una colina en un búfer RGBA w × h. */
export function mrfPaintLayer(
  px: Uint8ClampedArray,
  w: number,
  h: number,
  o: MrfPaintOptions,
  c0 = 0,
  c1 = w,
) {
  const { s, mx, top, W, H, spec, lit, shadow, haze, noise } = o;
  const out = new Uint32Array(px.buffer, px.byteOffset, w * h);
  const q = spec.q;
  const depthPx = Math.max(1, spec.depth * H);
  const A1 = 0.32 + 0.2 * q;
  const A2 = 0.08 + 0.2 * q;
  const A3 = 0.05 + 0.13 * q;
  const lane = q * 97 + 4096;
  const detailRows = Math.max(0, Math.min(h, Math.ceil((o.detailTo - top) * s)));
  const dn = Math.ceil(depthPx * s) + 2;
  const hzL = new Float32Array(dn);
  const tL = new Uint8Array(dn);
  const darkL = new Float32Array(dn);
  const creaseL = new Float32Array(dn);
  for (let j = 0; j < dn; j++) {
    const d = j / s;
    const t = mrfClamp(d / depthPx);
    hzL[j] = mrfClamp(spec.haze + 0.16 * (1 - q) * Math.exp(-d / 9) + 0.2 * (1 - q) * t * t);
    tL[j] = Math.round(t * (MRF_STEPS - 1));
    darkL[j] = 1 - 0.3 * t * t;
    creaseL[j] = 0.38 * (1 - t * 0.7);
  }
  const shadeT = new Float32Array(128 * MRF_STEPS);
  for (let mi = 0; mi < 128; mi++) {
    const mm = (mi / 127) * 4 - 2;
    for (let k = 0; k < MRF_STEPS; k++) shadeT[mi * MRF_STEPS + k] = mrfShade(mm, k / (MRF_STEPS - 1));
  }
  const sR = shadow[0];
  const sG = shadow[1];
  const sB = shadow[2];
  const dR = lit[0] - sR;
  const dG = lit[1] - sG;
  const dB = lit[2] - sB;
  const hR = haze[0];
  const hG = haze[1];
  const hB = haze[2];
  for (let c = Math.max(0, c0); c < Math.min(w, c1); c++) {
    const X = (c + 0.5) / s - mx;
    const cy = mrfCrestAt(spec, X, W, H);
    const m = ((mrfCrestAt(spec, X + 1 / s, W, H) - mrfCrestAt(spec, X - 1 / s, W, H)) * s) / 2;
    const seam = mrfSeamAt(spec, X, W);
    const row = Math.round((Math.max(-2, Math.min(2, m)) + 2) * 31.75) * MRF_STEPS;
    const cyRow = (cy - top) * s;
    const start = Math.max(0, Math.floor(cyRow) - 1);
    const pX = X * 0.045 + lane;
    const cX = X * 0.3 + 4096;
    const yBase = (start + 0.5) / s + top;
    for (let r = start; r < h; r++) {
      const dd = r + 0.5 - cyRow;
      const cov = dd + 0.5;
      if (cov <= 0) continue;
      const j = dd < 0 ? 0 : dd >= dn ? dn - 1 : dd | 0;
      const sh = shadeT[row + tL[j]] * darkL[j] * (1 - seam * creaseL[j]);
      let R = sR + dR * sh;
      let G = sG + dG * sh;
      let B = sB + dB * sh;
      if (r < detailRows) {
        const d = dd / s;
        const Y = yBase + (r - start) / s;
        const patch = mrfSample(noise, pX, d * 0.09 + Y * 0.02 + lane) - 0.5;
        const clump = mrfSample(noise, cX, d * 1.25 + lane) - 0.5;
        let g = Math.imul(c + 7919, 374761393) ^ Math.imul(r + 104729, 668265263);
        g = Math.imul(g ^ (g >>> 13), 1274126177);
        const grain = ((g ^ (g >>> 16)) >>> 0) / 4294967296 - 0.5;
        const tex = 1 + patch * A1 + clump * A2 + grain * A3;
        R *= tex;
        G *= tex;
        B *= tex;
      }
      const hz = hzL[j];
      R += (hR - R) * hz;
      G += (hG - G) * hz;
      B += (hB - B) * hz;
      const A = cov >= 1 ? 255 : (cov * 255) | 0;
      out[r * w + c] =
        ((A << 24) |
          ((B > 255 ? 255 : B < 0 ? 0 : B | 0) << 16) |
          ((G > 255 ? 255 : G < 0 ? 0 : G | 0) << 8) |
          (R > 255 ? 255 : R < 0 ? 0 : R | 0)) >>>
        0;
    }
  }
}

/** Franja de neblina que se repite a lo ancho, w × h, alfa 0–1. */
export function mrfMistBand(noise: Float32Array, w: number, h: number) {
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h;
    const bell = Math.exp(-Math.pow((v - 0.55) / 0.22, 2));
    for (let x = 0; x < w; x++) {
      const nx = (x * 256) / w;
      const a = noise[((((y * 96) / h) | 0) << 8) | (nx | 0)];
      const b = noise[(((((y * 40) / h) | 0) + 128) << 8) | (((nx * 2) | 0) & 255)];
      out[y * w + x] = mrfClamp((a * 0.65 + b * 0.35 - 0.36) * 2.6) * bell;
    }
  }
  return out;
}

/** 0 cuando la escena entra a la pantalla, 1 cuando llegó del todo. */
export function mrfArrival(top: number, height: number, vh: number) {
  const end = Math.max(0, vh - height);
  return mrfClamp((vh - top) / Math.max(1, vh - end));
}

export interface MrfStem {
  stem: string;
  parts: string[];
  x: number;
  order: number;
}

const f1 = (v: number) => (Math.round(v * 10) / 10).toString();

/** Flores de línea en una caja de 1200 × 420: tallo, hojas y una cabeza en cada una. */
export function mrfBotany(seed: number, count: number) {
  const rnd = mrfRng(seed * 31 + 5);
  const out: MrfStem[] = [];
  const B = 420;
  for (let k = 0; k < count; k++) {
    const x = 70 + (k + 0.2 + rnd() * 0.6) * (1060 / count);
    const hgt = 150 + rnd() * 230;
    const lean = (rnd() - 0.5) * 110;
    const ax = x;
    const ay = B;
    const bx = x + lean;
    const by = B - hgt;
    const cx = x + lean * 0.1 + (rnd() - 0.5) * 40;
    const cy = B - hgt * 0.55;
    const at = (t: number) => [
      (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx,
      (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by,
    ];
    const tan = (t: number) => {
      const dx = 2 * (1 - t) * (cx - ax) + 2 * t * (bx - cx);
      const dy = 2 * (1 - t) * (cy - ay) + 2 * t * (by - cy);
      const l = Math.hypot(dx, dy) || 1;
      return [dx / l, dy / l];
    };
    const parts: string[] = [];
    const leaves = 2 + Math.floor(rnd() * 3);
    for (let j = 0; j < leaves; j++) {
      const t = 0.14 + j * (0.55 / leaves) + rnd() * 0.05;
      const [px, py] = at(t);
      const [tx, ty] = tan(t);
      const side = j % 2 ? 1 : -1;
      const ang = 0.75 * side;
      const dx = tx * Math.cos(ang) - ty * Math.sin(ang);
      const dy = tx * Math.sin(ang) + ty * Math.cos(ang);
      const len = 26 + rnd() * 30;
      const ex = px + dx * len;
      const ey = py + dy * len;
      const nx = -dy * len * 0.28;
      const ny = dx * len * 0.28;
      const mx = (px + ex) / 2;
      const my = (py + ey) / 2;
      parts.push(
        "M" +
          f1(px) +
          " " +
          f1(py) +
          "Q" +
          f1(mx + nx) +
          " " +
          f1(my + ny) +
          " " +
          f1(ex) +
          " " +
          f1(ey) +
          "Q" +
          f1(mx - nx) +
          " " +
          f1(my - ny) +
          " " +
          f1(px) +
          " " +
          f1(py) +
          "M" +
          f1(px + dx * len * 0.15) +
          " " +
          f1(py + dy * len * 0.15) +
          "L" +
          f1(px + dx * len * 0.75) +
          " " +
          f1(py + dy * len * 0.75),
      );
    }
    const kind = Math.floor(rnd() * 4);
    if (kind === 0) {
      const r = 15 + rnd() * 9;
      const rot = rnd() * 6.28;
      for (let p = 0; p < 6; p++) {
        const a = rot + (p / 6) * 6.2832;
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        const sx = bx + ux * r * 0.22;
        const sy = by + uy * r * 0.22;
        const ex = bx + ux * r;
        const ey = by + uy * r;
        const w = r * 0.42;
        parts.push(
          "M" +
            f1(sx) +
            " " +
            f1(sy) +
            "C" +
            f1(sx + ux * r * 0.3 - uy * w) +
            " " +
            f1(sy + uy * r * 0.3 + ux * w) +
            " " +
            f1(ex - uy * w * 0.6) +
            " " +
            f1(ey + ux * w * 0.6) +
            " " +
            f1(ex) +
            " " +
            f1(ey) +
            "C" +
            f1(ex + uy * w * 0.6) +
            " " +
            f1(ey - ux * w * 0.6) +
            " " +
            f1(sx + ux * r * 0.3 + uy * w) +
            " " +
            f1(sy + uy * r * 0.3 - ux * w) +
            " " +
            f1(sx) +
            " " +
            f1(sy),
        );
      }
      const e = r * 0.2;
      parts.push(
        "M" +
          f1(bx - e) +
          " " +
          f1(by) +
          "a" +
          f1(e) +
          " " +
          f1(e) +
          " 0 1 0 " +
          f1(e * 2) +
          " 0a" +
          f1(e) +
          " " +
          f1(e) +
          " 0 1 0 " +
          f1(-e * 2) +
          " 0",
      );
    } else if (kind === 1) {
      const r = 16 + rnd() * 8;
      const n = 16;
      let d = "";
      for (let p = 0; p < n; p++) {
        const a = (p / n) * 6.2832 + rnd() * 0.15;
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        const ex = bx + ux * r;
        const ey = by + uy * r;
        d += "M" + f1(bx + ux * 2) + " " + f1(by + uy * 2) + "L" + f1(ex) + " " + f1(ey);
        d +=
          "M" +
          f1(ex - uy * 2.6) +
          " " +
          f1(ey + ux * 2.6) +
          "L" +
          f1(ex + uy * 2.6) +
          " " +
          f1(ey - ux * 2.6);
      }
      parts.push(d);
    } else if (kind === 2) {
      const [tx, ty] = tan(1);
      for (let p = 0; p < 6; p++) {
        const along = p * 7;
        const px = bx - tx * along;
        const py = by - ty * along;
        for (const side of [-1, 1]) {
          const ang = 0.5 * side;
          const dx = tx * Math.cos(ang) - ty * Math.sin(ang);
          const dy = tx * Math.sin(ang) + ty * Math.cos(ang);
          const len = 10 - p * 0.6;
          const ex = px + dx * len;
          const ey = py + dy * len;
          parts.push(
            "M" +
              f1(px) +
              " " +
              f1(py) +
              "Q" +
              f1(px + dx * len * 0.5 - dy * 2.5 * side) +
              " " +
              f1(py + dy * len * 0.5 + dx * 2.5 * side) +
              " " +
              f1(ex) +
              " " +
              f1(ey),
          );
        }
      }
    } else {
      const [tx, ty] = tan(1);
      const L = 18 + rnd() * 8;
      const w = L * 0.42;
      const ex = bx + tx * L;
      const ey = by + ty * L;
      parts.push(
        "M" +
          f1(bx) +
          " " +
          f1(by) +
          "C" +
          f1(bx - ty * w) +
          " " +
          f1(by + tx * w) +
          " " +
          f1(ex - ty * w * 0.5) +
          " " +
          f1(ey + tx * w * 0.5) +
          " " +
          f1(ex) +
          " " +
          f1(ey) +
          "C" +
          f1(ex + ty * w * 0.5) +
          " " +
          f1(ey - tx * w * 0.5) +
          " " +
          f1(bx + ty * w) +
          " " +
          f1(by - tx * w) +
          " " +
          f1(bx) +
          " " +
          f1(by),
        "M" +
          f1(bx - ty * 7) +
          " " +
          f1(by + tx * 7) +
          "Q" +
          f1(bx + tx * 4) +
          " " +
          f1(by + ty * 4) +
          " " +
          f1(bx + ty * 7) +
          " " +
          f1(by - tx * 7),
      );
    }
    out.push({
      stem: "M" + f1(ax) + " " + f1(ay) + "Q" + f1(cx) + " " + f1(cy) + " " + f1(bx) + " " + f1(by),
      parts,
      x: ax,
      order: k / Math.max(1, count - 1),
    });
  }
  return out;
}
