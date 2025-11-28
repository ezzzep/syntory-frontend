export const topListCards = {
  grid: `
    grid grid-cols-1 md:grid-cols-3 gap-6 mt-10
  `,

  card: `
    rounded-2xl p-6
    bg-white/5 backdrop-blur-xl
    border border-white/10
    shadow-lg shadow-black/30
    transition-all duration-300
    hover:bg-white/10 hover:border-white/20 hover:shadow-xl
  `,

  title: `
    text-lg font-semibold text-white tracking-wide mb-4
  `,

  listWrapper: `
    flex flex-col gap-2
  `,

  listItem: `
    flex items-center justify-between
    text-gray-300 text-sm
    px-2 py-2
    rounded-lg
    border border-white/5
    bg-white/5
    hover:bg-white/10 hover:border-white/20
    transition-all duration-200
  `,

  badge: `
    text-xs px-2 py-1 rounded-md bg-white/10 text-white
  `,
};
