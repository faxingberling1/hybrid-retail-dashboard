import prisma from '../lib/prisma'
async function main() {
  const cats = await prisma.storefrontCategory.findMany({ select: { slug: true, name: true } });
  console.log(cats);
}
main().catch(console.error).finally(() => prisma.$disconnect());
