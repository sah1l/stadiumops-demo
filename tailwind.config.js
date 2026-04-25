/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1B2133",
          "navy-2": "#1A2134",
          "navy-3": "#141A2A",
          gold: "#C9A449",
          "gold-2": "#E6C76A",
          "gold-3": "#8A6F2C",
          ink: "#0B0F1A",
          "ink-2": "#0E121C",
        },
        severity: {
          low: "#4ADE80",
          med: "#F59E0B",
          high: "#EF4444",
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
