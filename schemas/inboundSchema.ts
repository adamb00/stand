import { Unit } from '@prisma/client';
import { z } from 'zod';

export const InboundSchema = z.object({
  products: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z
          .string({ required_error: 'A név megadása kötelező.' })
          .min(1, { message: 'A név nem lehet üres.' }),
        quantity: z
          .number({ required_error: 'A mennyiség megadása kötelező.' })
          .min(1, { message: 'A mennyiség nem lehet 0 vagy negatív.' })
          .nullable(),
        unit: z
          .nativeEnum(Unit, { required_error: 'Az egység megadása kötelező.' })
          .nullable(),
        netUnitPrice: z
          .number({ required_error: 'A nettó egységár megadása kötelező.' })
          .min(1, { message: 'A mennyiség nem lehet 0 vagy negatív.' })
          .nullable(),
      })
    )
    .min(1, { message: 'Legalább egy terméket meg kell adni.' }),
});
