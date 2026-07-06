import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cranberry: {
          50: "#fff1f3",
          100: "#ffe4e8",
          500: "#d7274c",
          600: "#b91d3d",
          700: "#931532"
        },
        evergreen: {
          50: "#edfdf5",
          100: "#d4f8e7",
          500: "#148f61",
          600: "#087348",
          800: "#064831"
        },
        champagne: "#fff7e8"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(183, 29, 61, 0.2)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
