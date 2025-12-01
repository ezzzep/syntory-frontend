export const inventoryTableStyles = {
  wrapper: `
    w-full
  `,

  desktopWrapper: `
    hidden sm:block overflow-x-auto w-full
  `,

  table: `
    min-w-full table-fixed border border-gray-700
    rounded-2xl overflow-hidden shadow-xl
    bg-white/5 backdrop-blur-lg
  `,

  tableHeader: `
    bg-white/10 backdrop-blur-sm
  `,

  tableHeadCell: `
    text-left text-gray-300 uppercase text-sm font-semibold
    px-5 py-3 tracking-wide
    max-w-[200px] truncate overflow-hidden whitespace-nowrap
  `,

  tableRowHover: `
    hover:bg-white/10 transition-colors duration-300 cursor-default
  `,

  tableCell: `
    px-5 py-3 text-gray-300
    max-w-[150px] truncate overflow-hidden whitespace-nowrap
  `,

  tableCellName: `
    px-5 py-3 text-gray-100
    max-w-[200px] truncate overflow-hidden whitespace-nowrap
  `,

  actionCell: `
    px-5 py-3 flex gap-3 flex-wrap items-center min-w-[120px]
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
