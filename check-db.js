const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const brands = await prisma.brand.findMany();
  const sizes = await prisma.size.findMany();
  const sampleProducts = await prisma.product.findMany({
    take: 3,
    include: { brand: true, size: true }
  });

  console.log("USERS COUNT:", users);
  console.log("PRODUCTS COUNT:", products);
  console.log("BRANDS:", brands);
  console.log("SIZES:", sizes);
  console.log("SAMPLE PRODUCTS:", JSON.stringify(sampleProducts, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
