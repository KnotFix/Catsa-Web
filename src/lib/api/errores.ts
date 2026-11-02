/** Error de una respuesta de Catsa-Api. Conserva el cuerpo para leer los detalles. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly cuerpo: unknown,
  ) {
    super(`Catsa-Api respondió ${status}`);
    this.name = "ApiError";
  }

  get noEncontrado() {
    return this.status === 404;
  }

  get noAutorizado() {
    return this.status === 401;
  }
}

/** La API no respondió: conexión rechazada o tiempo de espera agotado. */
export function esFalloDeRed(error: unknown) {
  return error instanceof TypeError || (error instanceof DOMException && error.name === "TimeoutError");
}
