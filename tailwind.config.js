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
        heading: [
          "Satoshi",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        // Secondary/body font: same stack (so everything uses Helvetica)
        body: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        sans: ["Inter"],
      },
      colors: {
        primary: "#FCF6F5",
        secondary: "#111111",
        darkNeutral: "#1F1B24",
        lightNeutral: "#F5F3F7",
        coralRed: "#FE3939",
        hanBlue: "#526CC1",
        midGray: "#B3A9B6",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-slow": "marquee 90s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
