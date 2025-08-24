'use client'

export function StatusBar() {
  return (
    <div className="mobile-status-bar flex justify-between items-center text-white text-sm px-4 py-2">
      {/* Signal bars */}
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white/50 rounded"></div>
        </div>
        <div className="ml-2 flex items-center gap-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
        </div>
      </div>
      
      {/* Time */}
      <div className="font-medium">
        9:41
      </div>
      
      {/* Battery and other indicators */}
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white rounded"></div>
          <div className="w-1 h-3 bg-white/50 rounded"></div>
        </div>
        <div className="w-6 h-3 bg-white rounded-sm flex items-center justify-end pr-0.5">
          <div className="w-4 h-2 bg-slate-800 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
}