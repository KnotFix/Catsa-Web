import type { Metadata, Route } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { openGraphSitio } from "@/features/contenido/ajustes";
import { TablaEspecificaciones } from "@/features/sitio/components/explorador-productos";
import { PRODUCTOS } from "@/features/sitio/productos";
import "./estilos.css";

const producto = PRODUCTOS.find((p) => p.slug === "alcohol-etilico-neutro")!;
const ficha = producto.ficha!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${producto.nombre} · Ficha técnica`,
    description: `Ficha técnica del ${producto.nombre} de CATSA (${producto.codigo}): 96.1° GL mínimo, despacho a granel en cisternas de ${ficha.cisterna}.`,
    openGraph: await openGraphSitio({
      type: "article",
      images: [{ url: producto.foto.src, alt: producto.foto.alt }],
    }),
  };
}

const ICONOS = {
  Color: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  Olor: <path d="M12 3c2 4 5 5 5 9a5 5 0 0 1-10 0c0-4 3-5 5-9z" />,
  Sabor: <path d="M4 4h16M9 4v9a3 3 0 0 0 6 0V4M12 16v4" />,
};

export default function FichaAlcoholPage() {
  return (
    <div className="pg-ficha">
      <CabeceraPagina
        antetitulo={producto.categoria}
        titulo={producto.nombre}
        miga={[
          { titulo: "Productos", href: "/productos" },
          { titulo: producto.categoria, href: "/productos#alcoholes" as Route },
          { titulo: producto.nombre },
        ]}
        icono={
          <>
            <path pathLength={1} d="M9.5 3h5" />
            <path pathLength={1} d="M10.5 3v6L6 18.4A2 2 0 0 0 7.8 21.4h8.4a2 2 0 0 0 1.8-3L13.5 9V3" />
            <path pathLength={1} d="M8.4 15h7.2" />
          </>
        }
      >
        <div className="code-badge">
          <span>Código</span> {producto.codigo}
        </div>
        <p className="aka">
          <b>Otros nombres:</b> {producto.otrosNombres}
        </p>
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
            <div className="k">
              <div className="kn">
                96.1<small>°GL</small>
              </div>
              <div className="kl">Fortaleza alcohólica mínima</div>
            </div>
            <div className="k">
              <div className="kn">Incoloro</div>
              <div className="kl">A levemente coloreado</div>
            </div>
            <div className="k">
              <div className="kn">A granel</div>
              <div className="kl">Despacho en cisternas</div>
            </div>
            <div className="k">
              <div className="kn">
                {ficha.almacenamientoTotal}
                <small>M L</small>
              </div>
              <div className="kl">Capacidad de almacenamiento</div>
            </div>
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
            <p className="eyebrow">Especificaciones técnicas</p>
            <Titular texto="Parámetros de calidad certificados" />
          </div>
          <div data-reveal>
            <TablaEspecificaciones especificaciones={ficha.especificaciones} />
          </div>
          <p className="spec-note">
            Los parámetros son auditados bajo nuestras certificaciones internacionales de calidad e inocuidad.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-h" data-reveal>
            <p className="eyebrow">Presentación y logística</p>
            <Titular texto="Despacho a granel" />
          </div>
          <div className="pres">
            <div className="lead" data-reveal>
              <p>
                Este producto se despacha a granel en cisternas, sobre transportes adecuados para tal fin,
                garantizando la trazabilidad y calidad desde el tanque hasta el cliente.
              </p>
              <div className="cist">
                <div className="cl">Capacidad por cisterna</div>
                <div className="cn">{ficha.cisterna}</div>
              </div>
            </div>
            <div className="tanks" data-reveal>
              {ficha.tanques.map((t) => (
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
                  {ficha.almacenamientoTotal}
                  <small>M L</small>
                </div>
                <div className="tl">Capacidad total de almacenamiento de alcohol</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Cierre
        antetitulo="Cotizaciones"
        titulo={`¿Necesita ${producto.nombre} para su industria?`}
        texto="Solicite una cotización o la ficha técnica completa. Estamos a la orden."
        principal={{ titulo: "Solicitar información", href: "/contacto" }}
        secundario={{ titulo: "Ver todo el catálogo", href: "/productos" }}
      />
    </div>
  );
}
