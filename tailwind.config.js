/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Helvetica Neue", "sans-serif"],
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.35" },
          "50%":       { transform: "scale(1.18)", opacity: "0.7" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "dot-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.3" },
        },
        progress: {
          from: { width: "0%" },
          to:   { width: "100%" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.2s ease-in-out infinite",
        shimmer:      "shimmer 1.4s infinite",
        "fade-up":    "fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "dot-pulse":  "dot-pulse 1.4s ease-in-out infinite",
        progress:     "progress 2.6s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
