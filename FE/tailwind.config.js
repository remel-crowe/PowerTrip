/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "custom-top":
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
        "custom-top-lg":
          "0 -10px 15px -3px rgba(0, 0, 0, 0.3), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #008000" },
          "50%": { boxShadow: "0 0 20px #008000" },
          "100%": { boxShadow: "0 0 5px #008000" },
        },
      },
      animation: {
        glow: "glow 1.5s infinite alternate",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
