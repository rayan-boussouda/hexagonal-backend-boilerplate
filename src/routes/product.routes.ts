import { Router } from "express";
import { prismaProductRepository } from "../infra/product.adapter";
import { createProductService } from "../services/product.service";
import { createProductController } from "../controllers/product.controller";

const router = Router();

const prductService = createProductService(prismaProductRepository);
const productController = createProductController(prductService);
// router.post("/", controller.createUser);
router.get("/", productController.getAll);

export default router;
