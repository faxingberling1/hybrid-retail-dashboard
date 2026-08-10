import { queryAll } from '../lib/db'

async function main() {
  const allProducts = await queryAll(
    `SELECT count(*) FROM storefront_products`
  )
  console.log('Total products:', allProducts)
  
  const sample = await queryAll(
    `SELECT id, name, compare_at_price FROM storefront_products LIMIT 5`
  )
  console.log('Sample:', sample)
}

main()
