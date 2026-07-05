const { queryAll } = require('./lib/db');

async function test() {
  const products = await queryAll('SELECT name FROM storefront_products WHERE name ILIKE $1', ['%Dawn%']);
  console.log("Dawn products:", products);

  const kns = await queryAll('SELECT name FROM storefront_products WHERE name ILIKE $1', ['%K&N%']);
  console.log("K&N products:", kns);
  
  process.exit();
}
test();
