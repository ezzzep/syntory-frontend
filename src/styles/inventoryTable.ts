export const inventoryTableStyles = {
  wrapper: `
    w-full
  `,

  desktopWrapper: `
    hidden sm:block w-full overflow-x-auto
  `,

  table: `
    w-full border-separate border-spacing-0
    bg-gradient-to-br from-slate-800/30 to-slate-900/30
    backdrop-blur-xl rounded-2xl overflow-hidden
    shadow-2xl border border-slate-700/30
  `,

  tableHeader: `
    bg-gradient-to-r from-slate-700/40 to-slate-800/40
    backdrop-blur-sm
  `,

  tableHeadCell: `
    text-left text-white font-bold text-xs sm:text-sm
    px-6 py-4 tracking-wider uppercase
    border-b border-slate-600/30
    first:rounded-tl-xl last:rounded-tr-xl
    
  `,

  tableRowHover: `
    transition-all duration-300 cursor-arrow
    hover:bg-gradient-to-r hover:from-slate-700/20 hover:to-slate-800/20
    hover:shadow-inner
  `,

  tableCell: `
    px-6 py-4 text-gray-200 text-sm
    border-b border-slate-700/20 align-middle
  `,

  tableHead:
    "px-6 py-4 text-left text-white font-semibold text-sm border-b border-slate-600/30",

  tableCellName: `
    px-6 py-4 text-white font-medium text-sm
    border-b border-slate-700/20 align-middle
    
  `,

  tableCellDescription: `
    px-6 py-4 text-gray-200 text-sm
    border-b border-slate-700/20 align-middle
    max-w-[300px] truncate overflow-hidden
    whitespace-nowrap
  `,

  actionCell: `
    px-6 py-4 flex gap-2 items-center
    border-b border-slate-700/20 align-middle
    min-w-[180px]
  `,

  button: `
    bg-transparent
    border border-red-500/40 text-red-300 hover:bg-red-600/50 
    hover:text-red-200 hover:border-red-500/60
    hover:shadow-lg hover:shadow-red-500/20
    cursor-pointer transition-all duration-300
    rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium
  `,

  mobileCard: `
    bg-gradient-to-br from-slate-800/50 to-slate-900/50 
    backdrop-blur-xl rounded-2xl
    shadow-2xl border border-slate-700/30
    p-5 hover:from-slate-800/60 hover:to-slate-900/60
    transition-all duration-300 hover:scale-[1.02]
    hover:shadow-xl hover:shadow-slate-900/50
    cursor-pointer
  `,

  mobileLabel: `
    text-blue-300 font-semibold text-sm
    cursor-pointer
  `,

  mobileValue: `
    text-gray-100 font-medium text-sm
    cursor-pointer
  `,

  mobileValueSecondary: `
    text-gray-300 text-sm leading-relaxed
    cursor-pointer
  `,

  mobileActions: `
    flex gap-2 flex-wrap mt-4 pt-4 
    border-t border-slate-700/30
    cursor-pointer
  `,

  searchContainer: `
    relative flex-1 max-w-md
  `,

  searchInput: `
    w-full pl-12 pr-4 py-3 
    bg-gradient-to-r from-slate-800/50 to-slate-900/50 
    border border-slate-600/40 rounded-xl 
    text-white placeholder-slate-400 
    focus:outline-none focus:border-blue-500/60 
    focus:ring-2 focus:ring-blue-500/20 
    focus:from-slate-800/60 focus:to-slate-900/60
    transition-all duration-300 text-sm
  `,

  selectedItemsBar: `
    flex items-center gap-3 px-4 py-2 
    bg-gradient-to-r from-slate-700/40 to-slate-800/40 
    backdrop-blur-sm rounded-xl border border-slate-600/30
    cursor-pointer
  `,

  selectedCount: `
    text-sm text-slate-300 font-medium
    cursor-pointer
  `,

  tabsContainer: `
    flex flex-wrap gap-3 mb-8 p-1 
    bg-gradient-to-r from-slate-800/30 to-slate-900/30 
    backdrop-blur-sm rounded-2xl 
    border border-slate-700/30
    cursor-pointer
  `,

  tabButton: `
    relative px-5 py-2.5 rounded-xl font-medium text-sm 
    transition-all duration-300 min-w-[140px] justify-center
    cursor-pointer
  `,

  tabActive: `
    text-white shadow-xl scale-105
    bg-gradient-to-r from-slate-700/100 to-slate-800/60
    backdrop-blur-sm border border-slate-600/40
    cursor-pointer
  `,

  tabInactive: `
    text-slate-400 hover:text-white hover:bg-slate-700/20
    cursor-pointer
  `,

  tabGradient: `
    absolute inset-0 rounded-xl transition-all duration-300
    cursor-pointer
  `,

  tabContent: `
    relative flex items-center justify-center gap-2
    cursor-pointer
  `,

  tabBadge: `
    px-2 py-0.5 rounded-full text-xs font-semibold
    cursor-pointer
  `,

  tabBadgeActive: `
    bg-gradient-to-r from-blue-500/30 to-purple-500/30 
    text-blue-200 border border-blue-500/30
    cursor-pointer
  `,

  tabBadgeInactive: `
    bg-slate-700/40 text-slate-400
    cursor-pointer
  `,

  tabIndicator: `
    absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 
    w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 
    rounded-full shadow-lg shadow-blue-400/50
    cursor-pointer
  `,

  checkbox: `
    w-4 h-4 rounded border-slate-600 bg-slate-700/50 
    text-blue-500 focus:ring-2 focus:ring-blue-500/30 
    focus:ring-offset-0 focus:ring-offset-slate-800
    transition-all duration-200
    cursor-pointer
  `,

  checkboxChecked: `
    bg-blue-500/20 border-blue-500/60
    cursor-pointer
  `,

  quantityBadge: `
    inline-flex items-center justify-center 
    w-8 h-8 rounded-full text-xs font-bold text-white
    transition-all duration-300
    hover:scale-110
  `,

  quantityLow: `
  bg-red-600/90
  `,

  quantityMedium: `
    bg-gradient-to-br from-yellow-500 to-yellow-600 
    shadow-yellow-500/30
  `,

  quantityHigh: `
    bg-gradient-to-br from-blue-500 to-blue-600 
    shadow-blue-500/30
  `,

  emptyState: `
    text-center py-12 text-slate-400
    cursor-pointer
  `,

  emptyStateIcon: `
    w-16 h-16 mx-auto mb-4 text-slate-500
    cursor-pointer
  `,

  lowQuantityIndicator: `
    absolute -top-1 -right-1 flex items-center justify-center 
    bg-red-500 text-white rounded-full w-2 h-2 text-xs
    shadow-lg shadow-red-500/30 border border-red-600/50
    z-10 animate-pulse
    cursor-pointer
  `,
};
