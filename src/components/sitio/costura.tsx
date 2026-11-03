/**
 * El cierre de sección "cosido": el punto recorre la misma curva que la línea
 * mientras el trazo se dibuja detrás. Solo se ve en escritorio; en móvil manda
 * el cierre de fondo del CSS.
 */
export function Costura() {
  return (
    <div className="seam" aria-hidden>
      <svg viewBox="0 0 380 30" width="380" height="30">
        <path className="ln" pathLength={1} d="M0 15.5H160c12 0 14-11 30-11s18 11 30 11h160" />
        <circle className="pulse" cx="190" cy="4.5" r="3" />
        <circle className="bead" cx="0" cy="0" r="2.6" />
      </svg>
    </div>
  );
}

/** Divisor entre dos secciones del cuerpo: la misma costura, disparada por scroll. */
export function Divisor() {
  return (
    <div className="divider" aria-hidden>
      <Costura />
    </div>
  );
}
