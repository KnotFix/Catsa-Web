import type { Fila } from "../productos";

/**
 * Tabla de especificaciones de una ficha. Solo muestra las columnas que la
 * tabla usa: las microbiológicas no tienen mínimo ni método, por ejemplo.
 * Lo que no es un número (Negativo, Estándar…) ocupa mínimo y máximo.
 */
export function TablaEspecificaciones({ filas }: { filas: Fila[] }) {
  const conMinimo = filas.some((f) => f.minimo);
  const conMaximo = filas.some((f) => f.maximo);
  const conMetodo = filas.some((f) => f.metodo);
  const rango = Number(conMinimo) + Number(conMaximo) || 1;

  return (
    <div className="spec-wrap">
      <table className="spec">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Unidad</th>
            {conMinimo && <th className="num">Mínimo</th>}
            {conMaximo && <th className="num">Máximo</th>}
            {!conMinimo && !conMaximo && <th className="num">Especificación</th>}
            {conMetodo && <th>Método</th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.descripcion}>
              <td className="desc">{f.descripcion}</td>
              <td className="unit">{f.unidad}</td>
              {f.texto ? (
                <td className="val neg" colSpan={rango}>
                  {f.texto}
                </td>
              ) : (
                <>
                  {conMinimo && <td className="val">{f.minimo ?? "—"}</td>}
                  {conMaximo && <td className="val">{f.maximo ?? "—"}</td>}
                </>
              )}
              {conMetodo && <td className="met">{f.metodo ?? "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
