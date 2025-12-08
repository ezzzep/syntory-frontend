export const suppliersTableStyles = {
  wrapper: `
    w-full
    max-w-full
    overflow-hidden
  `,
  searchContainer: `
    relative flex-1 max-w-md
  `,
  searchInput: `
    w-full pl-12 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none  focus:border-transparent
  `,
  selectedItemsBar: `
    flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2
  `,
  selectedCount: `
    text-sm text-gray-300
  `,
  starButton: `
    bg-slate-800 hover:bg-slate-700 text-white border-slate-700 cursor-pointer hover:text-yellow-400
  `,

  trashButton: `
    bg-slate-800 hover:bg-slate-700 text-white border-slate-700 cursor-pointer hover:text-red-400
  `,
  tabsContainer: `
    flex space-x-1 sm:space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide
    -webkit-overflow-scrolling: touch
  `,
  tabButton: `
    relative flex-shrink-0 px-3 py-2 sm:px-4 rounded-lg transition-all duration-200 overflow-hidden
    min-w-fit
  `,
  tabActive: `
    bg-slate-800/50 text-white border border-slate-700
  `,
  tabInactive: `
    text-gray-400 hover:text-white hover:bg-slate-800/30
  `,
  tabGradient: `
    absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-200
  `,
  tabContent: `
    relative flex items-center gap-1 sm:gap-2 cursor-pointer
  `,
  tabBadge: `
    inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs font-medium
  `,
  tabBadgeActive: `
    bg-slate-700 text-white
  `,
  tabBadgeInactive: `
    bg-slate-700/50 text-gray-400
  `,
  tabIndicator: `
    absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500
  `,
  lowQuantityIndicator: `
    absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full
  `,
  desktopWrapper: `
    hidden lg:block overflow-x-auto
  `,
  tabletWrapper: `
    hidden md:block lg:hidden overflow-x-auto
  `,
  mobileWrapper: `
    md:hidden
  `,
  table: `
    w-full border-collapse
  `,
  tableHeader: `
    bg-slate-800/30 border-b border-slate-700
  `,
  tableHeadCell: `
    px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider
  `,
  tableRowHover: `
    hover:bg-slate-800/30 transition-colors
  `,
  tableCell: `
    px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-300
  `,
  tableCellName: `
    px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-white
  `,
  tableCellDescription: `
    px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-300 truncate max-w-xs
  `,
  actionCell: `
    px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium flex gap-2
  `,
  checkbox: `
    h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-opacity-25 cursor-pointer
  `,
  checkboxChecked: `
    bg-blue-600 border-blue-600
  `,
  emptyState: `
    text-center py-8 sm:py-12 text-gray-400 px-4
  `,
  emptyStateIcon: `
    w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-500
  `,
  mobileCard: `
    bg-slate-800/30 border border-slate-700 rounded-lg p-3 sm:p-4
    w-full
    max-w-full
    box-sizing: border-box
  `,
  mobileLabel: `
    text-xs text-gray-400
  `,
  mobileValueSecondary: `
    text-sm text-gray-300
    break-words
  `,
  mobileActions: `
    flex gap-2 justify-end
  `,
  quantityNumber: `
    text-sm font-medium
  `,
  statusBadge: `
    inline-flex px-2 py-1 text-xs font-medium rounded-full border
  `,
  statusActive: `
    bg-green-500/20 text-green-300 border-green-500/30
  `,
  statusInactive: `
    bg-red-500/20 text-red-300 border-red-500/30
  `,
  statusPending: `
    bg-yellow-500/20 text-yellow-300 border-yellow-500/30
  `,
};
