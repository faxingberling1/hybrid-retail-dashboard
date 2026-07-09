import { db } from '../lib/db'

async function seedCatalog() {
  console.log('Seeding equipments and addons...')

  const equipments = [
    { name: "Sunmi V2 Pro Mobile POS", description: "All-in-one mobile POS with built-in receipt printer", price: 45000, type: "Hardware", is_active: true },
    { name: "Epson TM-T88VI Receipt Printer", description: "High-speed thermal receipt printer for heavy traffic", price: 65000, type: "Hardware", is_active: true },
    { name: "Zebra DS2208 Barcode Scanner", description: "2D/1D Handheld Barcode Scanner with stand", price: 15000, type: "Hardware", is_active: true },
    { name: "Heavy Duty Cash Drawer", description: "RJ11 Cash Drawer compatible with standard receipt printers", price: 8500, type: "Hardware", is_active: true },
    { name: "Sunmi D2s Desktop POS", description: "15.6 inch Android Desktop POS System", price: 85000, type: "Hardware", is_active: true }
  ]

  const addons = [
    { name: "Premium Storefront", description: "Custom domain, advanced themes, and SEO tools", price: 5000, interval: "month", is_active: true, icon: "Globe" },
    { name: "Advanced Analytics", description: "Deep insights, custom reports, and export capabilities", price: 3000, interval: "month", is_active: true, icon: "BarChart" },
    { name: "Loyalty & Rewards Program", description: "Customer points, tiers, and referral system", price: 4000, interval: "month", is_active: true, icon: "Award" },
    { name: "Multi-Store Management", description: "Manage inventory and staff across multiple locations", price: 10000, interval: "month", is_active: true, icon: "Building" },
    { name: "Hardware Maintenance SLA", description: "Next-business-day replacement and priority support", price: 2500, interval: "month", is_active: true, icon: "Wrench" }
  ]

  await db.query('DELETE FROM equipments');
  await db.query('DELETE FROM addons');
  
  for (const eq of equipments) {
    await db.query(
      `INSERT INTO equipments (name, description, price, type, is_active) VALUES ($1, $2, $3, $4, $5)`,
      [eq.name, eq.description, eq.price, eq.type, eq.is_active]
    )
  }
  console.log('Added equipments')
  
  for (const ad of addons) {
    await db.query(
      `INSERT INTO addons (name, description, price, interval, is_active) VALUES ($1, $2, $3, $4, $5)`,
      [ad.name, ad.description, ad.price, ad.interval, ad.is_active]
    )
  }
  console.log('Added addons')
}

seedCatalog().then(() => {
  console.log('Done.')
  process.exit(0)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
