/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        MontserratRegular: ['Montserrat', 'cursive'],
        RoxboroughCFRegular: ['RoxboroughCF', 'cursive'],
        RoxboroughCFBold: ['RoxboroughCF', 'cursive'],
      },      
      colors: {
        brancoperola: "#faf9f6",
    },
  },
},
  plugins: [],
}