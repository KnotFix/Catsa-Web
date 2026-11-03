import { z } from "zod";

export const esquemaLogin = z.object({
  email: z.email("Escriba un correo válido."),
  password: z.string().min(1, "Escriba la contraseña."),
});

/** Código de la app (6 dígitos) o código de respaldo (8 dígitos, se aceptan con espacios o guiones). */
export const esquemaCodigo = z.object({
  codigo: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^(\d{6}|\d{8})$/, "Escriba los 6 dígitos de la app o un código de respaldo.")),
});

/** Al activar la 2FA solo vale el código de la app. */
export const esquemaCodigoApp = z.object({
  codigo: z.string().regex(/^\d{6}$/, "El código tiene 6 dígitos."),
});

export const esquemaOlvide = z.object({
  email: z.email("Escriba un correo válido."),
});

/** El mínimo de 12 y el resto de reglas los vuelve a revisar Django. */
export const esquemaNuevaClave = z
  .object({
    password: z.string().min(12, "Use al menos 12 caracteres."),
    confirmar: z.string(),
  })
  .refine((d) => d.password === d.confirmar, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmar"],
  });
