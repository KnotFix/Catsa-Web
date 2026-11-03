"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { anclaDe, CERTIFICACIONES, PRODUCTOS, type Producto } from "../productos";

type Pestana = "resumen" | "especificaciones" | "logistica";
const PESTANAS: { clave: Pestana; titulo: string }[] = [
  { clave: "resumen", titulo: "Resumen" },
  { clave: "especificaciones", titulo: "Especificaciones técnicas" },
  { clave: "logistica", titulo: "Presentación y logística" },
];

// El ancla de la URL (#alcoholes) abre el explorador en esa categoría o producto.
const suscribirAncla = (aviso: () => void) => {
  window.addEventListener("hashchange", aviso);
  return () => window.removeEventListener("hashchange", aviso);
};
const leerAncla = () => window.location.hash.slice(1).toLowerCase();

function indiceDeAncla(ancla: string) {
  if (!ancla) return null;
  const i = PRODUCTOS.findIndex((p) => p.slug === ancla || anclaDe(p.categoria) === ancla);
  return i < 0 ? null : i;
}

/**
 * Explorador del catálogo: selector agrupado por categoría, flechas (también
 * las del teclado) y tres pestañas por producto. Todo en la misma página.
 */
export function ExploradorProductos() {
  const ancla = useSyncExternalStore(suscribirAncla, leerAncla, () => "");
  const [elegido, setElegido] = useState<number | null>(null);
  const [pestana, setPestana] = useState<Pestana>("resumen");

  // Si cambia el ancla (un enlace del pie), manda ella sobre lo elegido a mano.
  const [anclaPrevia, setAnclaPrevia] = useState(ancla);
  if (ancla !== anclaPrevia) {
    setAnclaPrevia(ancla);
    setElegido(null);
  }

  const i = elegido ?? indiceDeAncla(ancla) ?? 0;
  const p = PRODUCTOS[i];
  const ir = (n: number) => setElegido((n + PRODUCTOS.length) % PRODUCTOS.length);

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      // Sin robarle las flechas a quien esté en el selector o escribiendo.
      if (/^(INPUT|SELECT|TEXTAREA)$/.test((document.activeElement as HTMLElement | null)?.tagName ?? ""))
        return;
      if (e.key === "ArrowLeft") setElegido((n) => ((n ?? i) - 1 + PRODUCTOS.length) % PRODUCTOS.length);
      if (e.key === "ArrowRight") setElegido((n) => ((n ?? i) + 1) % PRODUCTOS.length);
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [i]);

  const categorias = [...new Set(PRODUCTOS.map((x) => x.categoria))];

  return (
    <div className="explorer">
      <div className="exp-controls">
        <span className="exp-label">
          <span className="dot" /> Explore el catálogo
        </span>
        <div className="exp-select">
          <select aria-label="Producto" value={i} onChange={(e) => ir(Number(e.target.value))}>
            {categorias.map((c) => (
              <optgroup key={c} label={c}>
                {PRODUCTOS.map((x, k) =>
                  x.categoria === c ? (
                    <option key={x.slug} value={k}>
                      {x.nombre}
                    </option>
                  ) : null,
                )}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="exp-nav">
          <button type="button" className="navbtn" aria-label="Anterior" onClick={() => ir(i - 1)}>
            ←
          </button>
          <span className="counter" aria-live="polite">
            <b>{i + 1}</b> / {PRODUCTOS.length}
          </span>
          <button type="button" className="navbtn" aria-label="Siguiente" onClick={() => ir(i + 1)}>
            →
          </button>
        </div>
      </div>

      <div className="exp-main">
        <div className="exp-info" key={`info-${i}`}>
          <div className="cat">{p.categoria}</div>
          <h2>{p.nombre}</h2>
          <div className="code">Código {p.codigo}</div>
          {p.otrosNombres && (
            <div className="aka">
              <b className="text-catsa-ink">Otros nombres:</b> {p.otrosNombres}
            </div>
          )}
          <p className="desc">{p.descripcion}</p>
          <div className="chips">
            {p.etiquetas.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="exp-actions">
            <Link className="btn btn-primary" href="/contacto">
              Solicitar información
            </Link>
            {p.ficha && (
              <Link className="btn btn-line" href={p.ficha.href}>
                Ver ficha técnica completa
              </Link>
            )}
          </div>
        </div>
        <div className="exp-img">
          <Image
            key={`foto-${i}`}
            src={p.foto.src}
            alt={p.foto.alt}
            fill
            sizes="(max-width: 900px) 100vw, 560px"
          />
          <span className="badge">{p.codigo}</span>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Detalle del producto">
        {PESTANAS.map((t) => (
          <button
            key={t.clave}
            type="button"
            role="tab"
            id={`pestana-${t.clave}`}
            aria-controls="detalle-producto"
            aria-selected={pestana === t.clave}
            className="tab"
            onClick={() => setPestana(t.clave)}
          >
            {t.titulo}
          </button>
        ))}
      </div>
      <div
        className="tabpanel"
        id="detalle-producto"
        role="tabpanel"
        aria-labelledby={`pestana-${pestana}`}
        key={`${i}-${pestana}`}
      >
        <Detalle producto={p} pestana={pestana} />
      </div>
    </div>
  );
}

function Detalle({ producto: p, pestana }: { producto: Producto; pestana: Pestana }) {
  if (pestana === "resumen")
    return (
      <>
        <p className="ptab-p">{p.descripcion}</p>
        <p className="ptab-p mb-0">
          <b className="font-heading text-catsa-green">Usos principales:</b> {p.usos}
        </p>
        <p className="ptab-p mt-3.5 text-[13.5px]">Certificados bajo {CERTIFICACIONES}</p>
      </>
    );

  if (pestana === "especificaciones")
    return p.ficha ? (
      <>
        <div className="org">
          {p.ficha.organolepticas.map((o) => (
            <div key={o.nombre} className="ocard">
              <div className="ol">{o.nombre}</div>
              <p>{o.valor}</p>
            </div>
          ))}
        </div>
        <TablaEspecificaciones especificaciones={p.ficha.especificaciones} />
      </>
    ) : (
      <div className="note-box">
        <b>Ficha técnica completa disponible bajo solicitud.</b>
        <br />
        Este producto cumple con nuestros estándares certificados: {CERTIFICACIONES}.
      </div>
    );

  return p.ficha ? (
    <>
      <p className="ptab-p">
        Este producto se despacha a granel en cisternas, sobre transportes adecuados para tal fin, con
        trazabilidad desde el tanque hasta el cliente.
      </p>
      <div className="cist">
        <span className="cl">Capacidad por cisterna</span>
        <span className="cn">{p.ficha.cisterna}</span>
      </div>
      <div className="tanks">
        {p.ficha.tanques.map((t) => (
          <div key={t.nombre} className="tank">
            <div className="tn">
              {t.millones}
              <small> M L</small>
            </div>
            <div className="tl">{t.nombre}</div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="note-box">
      <b>Presentación según requerimiento.</b>
      <br />
      Consulte las presentaciones y formatos de despacho disponibles para este producto.
    </div>
  );
}

/** La comparten el explorador y la ficha técnica. */
export function TablaEspecificaciones({
  especificaciones,
}: {
  especificaciones: NonNullable<Producto["ficha"]>["especificaciones"];
}) {
  return (
    <div className="spec-wrap">
      <table className="spec">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Unidad</th>
            <th className="num">Mínimo</th>
            <th className="num">Máximo</th>
            <th>Método</th>
          </tr>
        </thead>
        <tbody>
          {especificaciones.map((s) => (
            <tr key={s.descripcion}>
              <td className="desc">{s.descripcion}</td>
              <td className="unit">{s.unidad}</td>
              {s.minimo === "Negativo" ? (
                <td className="val neg" colSpan={2}>
                  Negativo
                </td>
              ) : (
                <>
                  <td className="val">{s.minimo}</td>
                  <td className="val">{s.maximo}</td>
                </>
              )}
              <td className="met">{s.metodo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
