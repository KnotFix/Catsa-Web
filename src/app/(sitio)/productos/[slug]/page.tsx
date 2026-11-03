import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { openGraphSitio } from "@/features/contenido/ajustes";
import { TablaEspecificaciones } from "@/features/sitio/components/tabla-especificaciones";
import { anclaDe, PRODUCTOS, productoPorSlug, type Organoleptica } from "@/features/sitio/productos";
import "./estilos.css";

/**
 * Una ficha por producto con especificaciones publicadas (el arroz no tiene).
 * Con Cache Components no existe dynamicParams: lo que no está en la lista
 * termina en notFound().
 */
export function generateStaticParams() {
  return PRODUCTOS.filter((p) => p.ficha).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const producto = productoPorSlug((await params).slug);
  if (!producto) return {};
  return {
    title: `${producto.nombre} · Ficha técnica`,
    description: `Ficha técnica del ${producto.nombre} de CATSA (${producto.codigo}): ${producto.descripcion}`,
    openGraph: await openGraphSitio({
      type: "article",
      images: [{ url: producto.foto.src, alt: producto.foto.alt }],
    }),
  };
}

const ICONOS: Record<Organoleptica["nombre"], React.ReactNode> = {
  Color: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  Olor: <path d="M12 3c2 4 5 5 5 9a5 5 0 0 1-10 0c0-4 3-5 5-9z" />,
  Sabor: <path d="M4 4h16M9 4v9a3 3 0 0 0 6 0V4M12 16v4" />,
  Textura: (
    <>
      <circle cx="7" cy="8" r="1.6" />
      <circle cx="13" cy="6" r="1.6" />
      <circle cx="17" cy="11" r="1.6" />
      <circle cx="9" cy="14" r="1.6" />
      <circle cx="15" cy="17" r="1.6" />
    </>
  ),
  Apariencia: (
    <>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
};

const ICONO_CATEGORIA = {
  Alcoholes: (
    <>
      <path pathLength={1} d="M9.5 3h5" />
      <path pathLength={1} d="M10.5 3v6L6 18.4A2 2 0 0 0 7.8 21.4h8.4a2 2 0 0 0 1.8-3L13.5 9V3" />
      <path pathLength={1} d="M8.4 15h7.2" />
    </>
  ),
  Miel: <path pathLength={1} d="M12 3c3 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.5 6-11z" />,
  Azúcares: (
    <>
      <path pathLength={1} d="M3 8l9-5 9 5v8l-9 5-9-5V8z" />
      <path pathLength={1} d="M3 8l9 5 9-5" />
      <path pathLength={1} d="M12 13v8" />
    </>
  ),
  Arroz: <path pathLength={1} d="M12 21V9M12 9c0-3 2-5 5-6-1 3-2 5-5 6zM12 13c0-3-2-5-5-6 1 3 2 5 5 6z" />,
};

export default async function FichaProductoPage({ params }: PageProps<"/productos/[slug]">) {
  const producto = productoPorSlug((await params).slug);
  if (!producto?.ficha) notFound();
  const { ficha } = producto;

  return (
    <div className="pg-ficha">
      <CabeceraPagina
        antetitulo={producto.categoria}
        titulo={producto.nombre}
        bajada={producto.descripcion}
        miga={[
          { titulo: "Productos", href: "/productos" },
          { titulo: producto.categoria, href: `/productos#${anclaDe(producto.categoria)}` as Route },
          { titulo: producto.nombre },
        ]}
        icono={ICONO_CATEGORIA[producto.categoria]}
      >
        <div className="code-badge">
          <span>Código</span> {producto.codigo}
        </div>
        {producto.otrosNombres && (
          <p className="aka">
            <b>Otros nombres:</b> {producto.otrosNombres}
          </p>
        )}
        <div className="pf-btns">
          <Link className="btn btn-primary" href="/contacto">
            Solicitar cotización
          </Link>
          <Link className="btn btn-line" href="/contacto">
            Solicitar la ficha en PDF
          </Link>
        </div>
      </CabeceraPagina>

      <section className="keystrip">
        <div className="wrap">
          <div className="grid">
            {ficha.destacados.map((d) => (
              <div key={d.texto} className="k">
                <div className="kn">
                  {d.valor}
                  {d.unidad && <small>{d.unidad}</small>}
                </div>
                <div className="kl">{d.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-h" data-reveal>
            <p className="eyebrow">Propiedades organolépticas</p>
            <Titular texto="Cómo se percibe el producto" />
          </div>
          <div className="org">
            {ficha.organolepticas.map((o) => (
              <div key={o.nombre} className="ocard" data-reveal>
                <div className="ic">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {ICONOS[o.nombre]}
                  </svg>
                </div>
                <div className="ol">{o.nombre}</div>
                <p>{o.valor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <div className="sec-h" data-reveal>
            <p className="eyebrow">Especificaciones</p>
            <Titular texto="Parámetros de calidad" />
          </div>
          {ficha.tablas.map((t) => (
            <div key={t.titulo} className="tabla" data-reveal>
              {ficha.tablas.length > 1 && <h3>{t.titulo}</h3>}
              {t.frecuencia && <p className="frec">Frecuencia de análisis: {t.frecuencia.toLowerCase()}.</p>}
              <TablaEspecificaciones filas={t.filas} />
            </div>
          ))}
          {ficha.notas && (
            <div className="notas">
              {ficha.notas.map((n) => (
                <div key={n.titulo} className="nota" data-reveal>
                  <div className="nt">{n.titulo}</div>
                  <p>{n.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-h" data-reveal>
            <p className="eyebrow">Presentación y logística</p>
            <Titular texto={ficha.granel ? "Despacho a granel" : "Presentación del producto"} />
          </div>
          <div className={ficha.granel ? "pres" : "pres solo"}>
            <div className="lead" data-reveal>
              <ul className="pres-lista">
                {ficha.presentacion.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {ficha.granel && (
                <div className="cist mt-6">
                  <div className="cl">Capacidad por cisterna</div>
                  <div className="cn">{ficha.granel.cisterna}</div>
                </div>
              )}
            </div>
            {ficha.granel && (
              <div className="tanks" data-reveal>
                {ficha.granel.tanques.map((t) => (
                  <div key={t.nombre} className="tank">
                    <div className="tn">
                      {t.millones}
                      <small>M L</small>
                    </div>
                    <div className="tl">{t.nombre}</div>
                  </div>
                ))}
                <div className="tank total">
                  <div className="tn">
                    {ficha.granel.almacenamientoTotal}
                    <small>M L</small>
                  </div>
                  <div className="tl">Capacidad total de almacenamiento de alcohol</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Cierre
        antetitulo="Cotizaciones"
        titulo={`¿Necesita ${producto.nombre} para su industria?`}
        texto="Solicite una cotización o la ficha técnica en PDF. Estamos a la orden."
        principal={{ titulo: "Solicitar información", href: "/contacto" }}
        secundario={{ titulo: "Ver todo el catálogo", href: "/productos" }}
      />
    </div>
  );
}
