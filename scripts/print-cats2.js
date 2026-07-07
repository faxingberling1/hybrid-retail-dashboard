const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const cats = await prisma.storefrontCategory.findMany({ where: { parent_id: null }, select: { name: true } }); 
  console.log(cats.length, 'categories:', cats.map(c => c.name)); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
