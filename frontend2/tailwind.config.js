/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        BodoniMT: ['BodoniMT', 'cursive'],
        MontserratRegular: ['Montserrat', 'cursive'],
        RoxboroughCFRegular: ['RoxboroughCF', 'cursive'],
        RoxboroughCFBold: ['RoxboroughCF', 'cursive'],
      },      
      colors: {
        petroleo: "#1c2c3c",
        brancoPerola: "#faf9f6",
        douradoFosco: "#c2b280",
        prataClaraMetalica: "#c0c0c0",
        champanheClaro: "#f7e7ce",
    },
  },
},
  plugins: [],
}