export const supplierItemsCardStyles = {
  card: `
    bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm 
    border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-slate-900/30
  `,

  header: "flex justify-between items-center mb-6",

  titleContainer: "flex items-center gap-2",

  icon: "w-5 h-5 text-blue-400",

  title:
    "text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",

  addButton: `
    group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 
    hover:from-blue-700 hover:to-blue-800 transition-all duration-300 
    shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer
    flex items-center gap-2
  `,

  buttonIcon: "w-4 h-4",

  content: "min-h-[200px]",

  loadingContainer: "flex flex-col items-center justify-center py-12",

  spinner: `
    animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500
    shadow-lg shadow-blue-500/20
  `,

  loadingText: "mt-2 text-slate-400",

  itemsGrid: "grid grid-cols-1 md:grid-cols-2 gap-4",

  itemCard: `
    bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 
    rounded-xl p-4 transition-all duration-300 hover:from-slate-700/70 hover:to-slate-800/70 
    hover:shadow-xl hover:shadow-slate-900/20 hover:border-slate-600/70
  `,

  itemName: "font-medium text-white text-lg mb-2",

  itemDetails: "flex gap-2 mb-2",

  quantityBadge: `
    bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 
    px-2 py-1 rounded text-xs font-medium border border-blue-500/20
  `,

  categoryBadge: `
    bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-400 
    px-2 py-1 rounded text-xs font-medium border border-purple-500/20
  `,

  itemDescription: "text-slate-400 text-sm",

  emptyState: "flex flex-col items-center justify-center py-12 text-center",

  emptyIcon: "w-12 h-12 text-slate-500 mb-4",

  emptyTitle: "text-xl font-medium text-white mb-2",

  emptyDescription: "text-slate-400 mb-6 max-w-md",

  emptyButton: `
    group relative overflow-hidden border border-slate-600/50 text-slate-300 
    hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-800/50 
    hover:text-white transition-all duration-300 rounded-lg px-4 py-2
  `,
};
