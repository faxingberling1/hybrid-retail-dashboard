import { StoreHeader } from "@/components/storefront/store-header"
import { AuthModal } from "@/components/storefront/auth-modal"
import { AddressModal } from "@/components/storefront/address-modal"
import { MobileNav } from "@/components/storefront/mobile-nav"
import { FlashDealsPopup } from "@/components/storefront/flash-deals-popup"
import { CategoriesModal } from "@/components/storefront/categories-modal"
import { CartInitializer } from "@/components/storefront/cart-initializer"
import { db, queryAll } from "@/lib/db"

import { getStorefrontOrg, hexToHsl } from "@/lib/storefront-utils"

export const revalidate = 60;

export default async function StorefrontLayout({ children, params }: { children: React.ReactNode, params: Promise<{ subdomain: string }> }) {
  const resolvedParams = await params;
  const orgStorefront = await getStorefrontOrg();
  const orgId = orgStorefront?.organization_id;
  const industry = orgStorefront?.industry || 'pharmacy'; // Fallback to pharmacy
  const themeConfig = orgStorefront?.theme_config as any || {};

  let allCategories = [];
  if (industry === 'electronics') {
    allCategories = [
      { id: 'c1', name: 'Smartphones', slug: 'smartphones', parent_id: null },
      { id: 'c2', name: 'Laptops', slug: 'laptops', parent_id: null },
      { id: 'c3', name: 'Audio', slug: 'audio', parent_id: null },
      { id: 'c4', name: 'Gaming', slug: 'gaming', parent_id: null },
      { id: 'c5', name: 'Wearables', slug: 'wearables', parent_id: null }
    ];
  } else if (industry === 'pharmacy') {
    allCategories = [
      { id: 'c1', name: 'Vitamins', slug: 'vitamins', parent_id: null },
      { id: 'c2', name: 'Over the Counter', slug: 'otc', parent_id: null },
      { id: 'c3', name: 'First Aid', slug: 'first-aid', parent_id: null },
      { id: 'c4', name: 'Medical Devices', slug: 'devices', parent_id: null },
      { id: 'c5', name: 'Personal Care', slug: 'personal-care', parent_id: null }
    ];
  } else if (industry === 'fashion') {
    allCategories = [
      { id: 'fc1', name: 'Women', slug: 'women', parent_id: null },
      { id: 'fc2', name: 'Men', slug: 'men', parent_id: null },
      { id: 'fc3', name: 'Shoes', slug: 'shoes', parent_id: null },
      { id: 'fc4', name: 'Accessories', slug: 'accessories', parent_id: null },
      { id: 'fc5', name: 'Activewear', slug: 'activewear', parent_id: null }
    ];
  } else if (industry === 'restaurant') {
    allCategories = [
      { id: 'rc1', name: 'Starters', slug: 'starters', parent_id: null },
      { id: 'rc2', name: 'Mains', slug: 'mains', parent_id: null },
      { id: 'rc3', name: 'Desserts', slug: 'desserts', parent_id: null },
      { id: 'rc4', name: 'Beverages', slug: 'beverages', parent_id: null },
      { id: 'rc5', name: 'Combos', slug: 'combos', parent_id: null }
    ];
  } else {
    if (orgId) {
      allCategories = await db.query(
        'SELECT * FROM storefront_categories WHERE is_active = true AND organization_id = $1 ORDER BY name ASC',
        [orgId]
      ).then(res => res.rows || []);
    } else {
      allCategories = await queryAll(
        'SELECT * FROM storefront_categories WHERE is_active = true AND organization_id IS NULL ORDER BY name ASC'
      );
    }
  }
  
  // Only pass parent categories to header for the hamburger menu
  const parentCategories = allCategories.filter((c: any) => c.parent_id === null)

  const primaryHsl = themeConfig.primaryColor ? hexToHsl(themeConfig.primaryColor) : hexToHsl('#ffc000');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-rose-500/20 pb-16 md:pb-0">
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
      <CartInitializer industry={industry} />
      <StoreHeader categories={parentCategories} customLogoUrl={themeConfig.logoUrl} industry={industry} themeConfig={themeConfig} />
      <AuthModal organizationId={orgId || ''} />
      <FlashDealsPopup />
      <CategoriesModal categories={allCategories} />
      <div className="flex-1">
        {children}
      </div>
      <MobileNav themeConfig={themeConfig} />
      <AddressModal />
    </div>
  )
}

