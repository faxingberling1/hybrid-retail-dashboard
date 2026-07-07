import React from "react"

export function ProductRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[180px] md:w-[220px] flex-shrink-0 h-[300px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col animate-pulse">
          <div className="w-full aspect-square bg-slate-200 rounded-xl mb-3"></div>
          <div className="w-3/4 h-4 bg-slate-200 rounded mb-2 mt-2"></div>
          <div className="w-1/2 h-4 bg-slate-200 rounded mb-4"></div>
          <div className="mt-auto flex flex-col gap-2">
            <div className="w-1/3 h-3 bg-slate-200 rounded"></div>
            <div className="w-1/2 h-5 bg-slate-200 rounded"></div>
            <div className="w-full h-8 bg-slate-200 rounded mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
