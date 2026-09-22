import z from "zod";
import prisma from "../config/prisma";
import { ProductRepository } from "../domains/product.port";
import { productSchema } from "../domains/product";

export const prismaProductRepository: ProductRepository = {
  getAll: async () => {
    const products = await prisma.product.findMany();
    return z.array(productSchema).parse(products);
  },
};
