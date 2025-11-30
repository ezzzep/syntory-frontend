export const inventoryTableStyles = {
  wrapper: `
    w-full
  `,

  desktopWrapper: `
    hidden sm:block overflow-x-auto w-full
  `,

  table: `
    min-w-full border border-gray-700
    rounded-2xl overflow-hidden shadow-xl
    bg-white/5 backdrop-blur-lg
  `,

  tableHeader: `
    bg-white/10 backdrop-blur-sm
  `,

  tableHeadCell: `
    text-left text-gray-300 uppercase text-sm font-semibold
    px-5 py-3 tracking-wide
  `,

  tableRowHover: `
    hover:bg-white/10 transition-colors duration-300 cursor-default
  `,

  tableCell: `
    px-5 py-3 text-gray-300
  `,

  tableCellName: `
    px-5 py-3 font-semibold text-gray-100
  `,

  actionCell: `
    px-5 py-3 flex gap-3 flex-wrap items-center
  `,

  button: `
    bg-transparent border border-gray-500 text-gray-300
    hover:bg-red-600 hover:text-white
    cursor-pointer transition-colors duration-300
    rounded-md px-3 py-1 text-sm
  `,

  editButton: `
    bg-transparent border border-gray-500 text-gray-300
    hover:bg-blue-600 hover:text-white
    cursor-pointer transition-colors duration-300
    rounded-md px-3 py-1 text-sm
  `,

  mobileCard: `
    bg-white/5 backdrop-blur-lg rounded-2xl
    shadow-xl p-5 hover:bg-white/10
    transition-colors duration-300
  `,

  mobileLabel: `
    text-gray-300 font-semibold text-sm
  `,

  mobileValue: `
    text-gray-100 font-medium text-sm
  `,

  mobileValueSecondary: `
    text-gray-300 text-sm
  `,

  mobileActions: `
    flex gap-3 flex-wrap mt-4
  `,
};
