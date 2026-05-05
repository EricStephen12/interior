const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  const brands = await prisma.brand.count()
  const sizes = await prisma.size.count()
  console.log(`Brands: ${brands}, Sizes: ${sizes}`)
  process.exit(0)
}

check()
