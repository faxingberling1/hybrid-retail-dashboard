import { db } from "@/lib/db"
import Link from "next/link"
import { ArrowLeft, Store } from "lucide-react"
import { StorefrontContentManager } from "./storefront-content-manager"

export const dynamic = 'force-dynamic'

export default async function TenantStorefrontManagementPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params

  const result = await db.query(
    "SELECT id, name FROM organizations WHERE id = $1",
    [orgId]
  )

  if (result.rows.length === 0) {
    return <div>Organization not found</div>
  }

  const organization = result.rows[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/super-admin/storefronts" 
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Store className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{organization.name} Storefront Content</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Manage products, categories, and banners</p>
          </div>
        </div>
      </div>

      <StorefrontContentManager orgId={orgId} />
    </div>
  )
}
