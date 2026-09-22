import { faker } from "@faker-js/faker";
import prisma from "../src/config/prisma";

async function main() {
  await prisma.product.createMany({
    data: Array.from({ length: 20 }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
