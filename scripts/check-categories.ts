import prisma from '../lib/prisma'

async function check() {
  const cats = await prisma.storefrontCategory.findMany()
  console.log(cats.map(c => c.slug))
}

check().finally(() => prisma.$disconnect())
