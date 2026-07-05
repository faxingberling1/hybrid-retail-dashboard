import prisma from '../lib/prisma'

async function main() {
  const prod = await prisma.storefrontProduct.findMany({
    where: { name: { contains: 'Paratha' } }
  })
  console.log(prod)
}

main().finally(() => prisma.$disconnect())
