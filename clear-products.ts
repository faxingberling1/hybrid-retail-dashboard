import { pool } from './lib/db';
async function main() {
  await pool.query('DELETE FROM storefront_products');
  console.log('Deleted all storefront products');
  process.exit(0);
}
main().catch(console.error);
