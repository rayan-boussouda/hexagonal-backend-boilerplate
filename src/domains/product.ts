import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.coerce.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof productSchema>;
