export const homeStyles = {
  bgDesktopWrapper: `
    hidden sm:block
  `,
  bgDesktopImage: `
    object-cover object-center
  `,
  mobileWrapper: `
    sm:hidden absolute top-12 w-full flex justify-center
  `,
  mobileImageContainer: `
    relative w-100 h-80
  `,
  mobileImage: `
    object-contain
  `,
  mainWrapper: `
    relative min-h-screen flex items-end justify-center pb-20 px-6
    bg-white sm:bg-transparent
  `,
  buttonsContainer: `
    relative z-10 w-full max-w-md flex flex-col sm:flex-row items-center gap-4 sm:gap-6
  `,
  loginButton: `
    w-full px-6 py-3 text-base sm:text-lg font-semibold
    bg-white text-black border border-black/20 rounded-xl shadow-md
    hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer
  `,
  signupButton: `
    w-full px-6 py-3 text-base sm:text-lg font-semibold
    bg-black text-white border border-white/20 rounded-xl shadow-md
    hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer
  `,
};
