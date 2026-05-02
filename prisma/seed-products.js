const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Create missing categories and brands
  const brand = await prisma.brand.upsert({
    where: { slug: 'sharers-elite' },
    update: {},
    create: { name: 'Sharers Elite', slug: 'sharers-elite', description: 'Premium tier gear' }
  })

  const size = await prisma.size.upsert({
    where: { slug: 'standard' },
    update: {},
    create: { name: 'Standard', slug: 'standard' }
  })

  const categories = ['Memberships', 'Training', 'Recovery', 'Apparel', 'Nutrition']
  const catMap = {}
  for (const c of categories) {
    catMap[c] = await prisma.category.upsert({
      where: { slug: c.toLowerCase() },
      update: {},
      create: { name: c, slug: c.toLowerCase(), description: c }
    })
  }

  // Define products
  const products = [
    {
      name: 'Sharers Obsidian Black Membership',
      price: 1200,
      description: "This is the full Sharers experience. Unlimited access, priority everything, and a community of people who take it as seriously as you do. Not for everyone — but if you're reading this, you already know if it's for you.",
      cat: 'Memberships',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Neural Peak Training Session',
      price: 450,
      description: "One session built entirely around you — your body, your targets, your pace. Our coaches don't follow a script. They follow your progress.",
      cat: 'Training',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Hyper-Oxygen Recovery Protocol',
      price: 550,
      description: "The work doesn't end when the set does. Recovery is where the body actually changes — and this protocol makes sure you don't leave that part to chance.",
      cat: 'Recovery',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Sharers Performance Tech-Knit',
      price: 85,
      description: "Wear something that moves the way you do. Built for the gym, comfortable enough that you'll forget you're wearing it.",
      cat: 'Apparel',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef03a74e7f?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Sharers NOIR Isolate Alpha',
      price: 125,
      description: "Clean protein. No nonsense on the label. Exactly what your body needs after putting in the work — nothing it doesn't.",
      cat: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80'
    }
  ]

  console.log('Clearing old products...')
  await prisma.productCategory.deleteMany()
  await prisma.product.deleteMany()

  console.log('Inserting new products...')
  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/\s+/g, '-')
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: slug,
        description: p.description,
        price: p.price,
        imageUrl: p.image,
        inStock: true,
        brandId: brand.id,
        sizeId: size.id,
      }
    })

    await prisma.productCategory.create({
      data: {
        productId: product.id,
        categoryId: catMap[p.cat].id
      }
    })
    console.log('Added:', p.name)
  }

  console.log('Done seeding products!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
