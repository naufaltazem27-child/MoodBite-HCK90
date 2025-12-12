/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mood: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFC107",
          600: "#FFB300",
          700: "#FFA000",
          800: "#FF6F00",
          900: "#E65100",
        },
        fresh: {
          green: "#4ECDC4",
          dark: "#1A535C",
        },
        danger: "#FF6B6B",
      },
      fontFamily: {
        sans: ['"Quicksand"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
