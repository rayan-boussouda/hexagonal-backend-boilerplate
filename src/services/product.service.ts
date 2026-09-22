import { ProductRepository } from "../domains/product.port";

export const createProductService = (repository: ProductRepository) => ({
  getAllProducts: () => repository.getAll(),
});
