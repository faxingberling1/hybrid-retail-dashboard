import { StoreHeader } from "@/components/storefront/store-header"
import { AuthModal } from "@/components/storefront/auth-modal"
import { AddressModal } from "@/components/storefront/address-modal"
import { MobileNav } from "@/components/storefront/mobile-nav"
import { db, queryAll } from "@/lib/db"

import { getStorefrontOrg, hexToHsl } from "@/lib/storefront-utils"

export const revalidate = 60;

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const orgStorefront = await getStorefrontOrg();
  const orgId = orgStorefront?.organization_id;
  const themeConfig = orgStorefront?.theme_config as any || {};

  let allCategories = [];
  if (orgId) {
    allCategories = await db.query(
      'SELECT * FROM storefront_categories WHERE is_active = true AND organization_id = $1 ORDER BY name ASC',
      [orgId]
    ).then(res => res.rows || []);
  } else {
    // Fallback to global categories if no org is found (optional, depending on requirements)
    allCategories = await queryAll(
      'SELECT * FROM storefront_categories WHERE is_active = true AND organization_id IS NULL ORDER BY name ASC'
    );
  }
  
  // Only pass parent categories to header for the hamburger menu
  const parentCategories = allCategories.filter((c: any) => c.parent_id === null)

  const primaryHsl = themeConfig.primaryColor ? hexToHsl(themeConfig.primaryColor) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-rose-500/20 pb-16 md:pb-0">
      {primaryHsl && (
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${primaryHsl};
              --ring: ${primaryHsl};
            }
            .dark {
              --primary: ${primaryHsl};
              --ring: ${primaryHsl};
            }
          `
        }} />
      )}
      <StoreHeader categories={parentCategories} customLogoUrl={themeConfig.logoUrl} />
      <AuthModal />
      <div className="flex-1">
        {children}
      </div>
      <MobileNav />
      <AddressModal />
    </div>
  )
}
