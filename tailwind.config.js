/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0B1526",
          900: "#101E38",
          800: "#14213D",
          700: "#1D2E52",
        },
        paper: "#FAF6EC",
        parchment: "#F1EADA",
        gold: {
          600: "#A9821B",
          500: "#C9A227",
          400: "#DDBB4E",
        },
        ink: "#1B2333",
        approved: "#3E6E56",
        rejected: "#A6412A",
        pending: "#B3841F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(20,33,61,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        stub: "0 1px 0 rgba(20,33,61,0.06), 0 8px 24px -12px rgba(20,33,61,0.25)",
      },
    },
  },
  plugins: [],
};
