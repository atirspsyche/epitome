/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    extend: {
      fontFamily: {
        // Primary heading font: Helvetica (or system sans-serif fallback)
        heading: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        // Secondary/body font: same stack (so everything uses Helvetica)
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        primary: "#00D1FF",
        secondary: "#FF3D6B",
        darkNeutral: "#1F1B24",
        lightNeutral: "#F5F3F7",
        midGray: "#B3A9B6",
      },
    },
  },
  plugins: [],
};
