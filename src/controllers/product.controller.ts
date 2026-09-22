import { Request, Response, NextFunction } from "express";
import { createProductService } from "../services/product.service";

export const createProductController = (
  service: ReturnType<typeof createProductService>,
) => ({
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await service.getAllProducts();

      return res.json(products);
    } catch (error) {
      next();
    }
  },
});
