import { db } from "@/lib/db"
import Link from "next/link"
import { Globe, ArrowRight, Settings } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function TenantStorefrontsPage() {
  const result = await db.query(`
    SELECT o.id, o.name, s.subdomain, s.theme_config 
    FROM organizations o
    LEFT JOIN organization_storefronts s ON o.id = s.organization_id
    ORDER BY o.name ASC
  `)
  
  const organizations = result.rows || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tenant Storefronts</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Manage content across all tenant storefronts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org: any) => (
          <div key={org.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Globe className="h-5 w-5" />
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${
                org.subdomain 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' 
                  : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20'
              }`}>
                {org.subdomain ? 'Active' : 'Unconfigured'}
              </span>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">{org.name}</h3>
            <p className="text-xs font-bold text-slate-500 mt-1 mb-6 truncate">
              {org.subdomain ? `${org.subdomain}.hybridpos.pk` : 'No subdomain set'}
            </p>

            <div className="flex items-center space-x-2">
              <Link 
                href={`/super-admin/storefronts/${org.id}`}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                <span>Manage Content</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href={`/super-admin/organizations`}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
                title="Storefront Config"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
