import prisma from './lib/prisma';

async function check() {
  const orderId = '32132BBD'; // I will just check any order actually
  const orders = await prisma.storefrontOrder.findMany({
    include: { items: true }
  });
  
  if (orders.length === 0) {
    console.log("No orders found");
    return;
  }
  
  for (const order of orders) {
    console.log(`Order: ${order.id}`);
    for (const item of order.items) {
      console.log(` - Item: ${item.name}, product_id: ${item.product_id}`);
      const product = await prisma.storefrontProduct.findUnique({
        where: { id: item.product_id }
      });
      if (!product) {
        console.log(`   -> Product NOT FOUND`);
      } else {
        console.log(`   -> Product found! image_url: ${product.image_url}`);
      }
    }
  }
}

check().catch(console.error).finally(() => process.exit(0));
