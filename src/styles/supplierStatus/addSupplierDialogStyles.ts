export const addSupplierDialogStyles = {
  dialogTrigger: `
    group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 
    hover:from-blue-700 hover:to-blue-800 transition-all duration-300 
    shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer
  `,

  dialogTriggerSpan: `
    absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 
    to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700
  `,

  dialogContent: `
    bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl text-white 
    border border-slate-700/50 rounded-2xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto
  `,

  dialogHeader: `
    relative pb-6 border-b border-slate-700/30
  `,

  dialogTitle: `
    text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent
  `,

  formContainer: `
    space-y-6 pt-6
  `,

  formRow: `
    grid grid-cols-1 gap-4 md:grid-cols-2
  `,

  formField: `
    space-y-2
  `,

  label: `
    flex items-center text-sm font-medium text-blue-300
  `,

  input: `
    w-full h-12 border-slate-600/40 bg-slate-700/30 text-white 
    placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 
    focus:ring-blue-500/20 transition-all duration-200 rounded-lg cursor-text
  `,

  select: `
    w-full h-12 appearance-none border-slate-600/40 bg-slate-700/30 text-white 
    rounded-lg px-4 pr-10 focus:border-blue-500/50 focus:ring-2 
    focus:ring-blue-500/20 transition-all duration-200 cursor-pointer
  `,

  selectOption: `
    bg-slate-800 text-white
  `,

  selectIcon: `
    absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none
  `,

  dateInput: `
    w-full h-12 border-slate-600/40 bg-slate-700/30 text-white 
    placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 
    focus:ring-blue-500/20 transition-all duration-200 rounded-lg pr-10 cursor-pointer
  `,

  dateButton: `
    absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 
    hover:text-blue-300 transition-colors duration-200 cursor-pointer
  `,

  error: `
    text-red-400 text-sm mt-1
  `,

  footer: `
    flex gap-3 mt-8 pt-6 border-t border-slate-700/30
  `,

  cancelButton: `
    flex-1 h-12 border-slate-600/50 bg-transparent text-slate-300 
    hover:bg-slate-700/30 hover:text-white transition-all duration-200 rounded-lg cursor-pointer
  `,

  saveButton: `
    flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 
    hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 
    transition-all duration-200 rounded-lg cursor-pointer
  `,

  loadingSpinner: `
    animate-spin -ml-1 mr-3 h-5 w-5 text-white
  `,
};
