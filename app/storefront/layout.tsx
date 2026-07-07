import { StoreHeader } from "@/components/storefront/store-header"
import { StoreFooter } from "@/components/storefront/store-footer"
import { AuthModal } from "@/components/storefront/auth-modal"
import { AddressModal } from "@/components/storefront/address-modal"
import { MobileNav } from "@/components/storefront/mobile-nav"
import { db, queryAll } from "@/lib/db"

export const revalidate = 60;

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const allCategories = await queryAll(
    'SELECT * FROM storefront_categories WHERE is_active = true ORDER BY name ASC'
  )
  
  // Only pass parent categories to header for the hamburger menu
  const parentCategories = allCategories.filter((c: any) => c.parent_id === null)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-rose-500/20 pb-16 md:pb-0">
      <StoreHeader categories={parentCategories} />
      <AuthModal />
      <div className="flex-1">
        {children}
      </div>
      <StoreFooter />
      <MobileNav />
      <AddressModal />
    </div>
  )
}
