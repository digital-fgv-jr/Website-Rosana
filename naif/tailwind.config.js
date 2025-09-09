/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        brand: ['"Bodoni Moda"', "serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
