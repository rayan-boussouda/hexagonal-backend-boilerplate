import { Product } from "./product";

export type ProductRepository = {
  getAll: () => Promise<Product[]>;
};
