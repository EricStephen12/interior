const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    products: await prisma.product.count(),
    categories: await prisma.category.count(),
    brands: await prisma.brand.count(),
    settings: await prisma.storeSetting.count(),
    deliveryZones: await prisma.deliveryZone.count(),
    blogs: await prisma.blogPost.count(),
    orders: await prisma.order.count(),
    paidOrders: await prisma.order.count({ where: { status: 'PAID' } }),
    checkIns: await prisma.checkIn.count(),
    reviews: await prisma.review.count(),
    supportTickets: await prisma.supportTicket.count(),
  };

  console.log("DATABASE COUNTS:");
  console.table(counts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
