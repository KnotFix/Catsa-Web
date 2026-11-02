import { z } from "zod";

export const esquemaLogin = z.object({
  email: z.email("Escriba un correo válido."),
  password: z.string().min(1, "Escriba la contraseña."),
});

export const esquemaCodigo = z.object({
  codigo: z.string().regex(/^\d{6}$/, "El código tiene 6 dígitos."),
});
