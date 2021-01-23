const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      ...colors,
      wa: {
        light: "#1EBEA5",
        alt: "#02877A",
        chat: "#DCF8C6",
        DEFAULT: "#075E55",
        dark: "#054C44"
      },
      "wa-gray": {
        light: "#999999",
        lighter: "##00000026",
        DEFAULT: "#000000B3",
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
