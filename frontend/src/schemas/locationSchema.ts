import { z } from 'zod';

// Location form validation schema
export const locationSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .min(2, 'El código debe tener al menos 2 caracteres')
    .max(10, 'El código no puede tener más de 10 caracteres')
    .regex(
      /^[A-Z0-9_-]+$/,
      'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'
    ),

  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .trim(),

  image: z
    .string()
    .min(1, 'La imagen es requerida')
    .url('Debe ser una URL válida')
    .refine(url => {
      // Check if URL ends with common image extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const lowercaseUrl = url.toLowerCase();
      return imageExtensions.some(ext => lowercaseUrl.includes(ext));
    }, 'La URL debe apuntar a una imagen válida (jpg, jpeg, png, gif, webp, svg)'),
});

// Type inference from schema
export type LocationFormData = z.infer<typeof locationSchema>;

// Validation helper
export const validateLocationForm = (data: unknown) => {
  return locationSchema.safeParse(data);
};
