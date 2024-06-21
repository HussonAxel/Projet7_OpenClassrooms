/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      yellow: "#FFD15B",
      grey: "#7A7A7A",
      black: "#1B1B1B",
      white: "#FFFFFF",
      backgroundWhite: "#EDEDED",
    },
    screens: {
      sm: "640px",
      md: "872px",
      lg: "1024px",
      xl: "100px",
    },
    extend: {
      backgroundImage: {
        "hero-pattern": "url('./assets/banner-background.png')",
      },
      fontFamily: {
        Anton: ["Anton", ...defaultTheme.fontFamily.sans],
        Manrope: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        "xl": "1440px"
      }
    },
  },
  plugins: [],
};
