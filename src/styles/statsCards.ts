export const statsCardsStyles = {
  grid: `
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
  `,

  card: `
    backdrop-blur-lg bg-white/5 border border-white/10
    rounded-2xl p-5 flex items-center gap-4 shadow-xl
    hover:bg-white/10 transition
  `,

  iconWrapper: `
    w-14 h-14 rounded-full flex items-center justify-center
  `,

  value: `
    text-2xl font-bold text-white
  `,

  label: `
    text-gray-300 text-sm
  `,

  badge: `
    text-xs px-2 py-1 rounded-full text-white mt-1 inline-block
  `,
};
