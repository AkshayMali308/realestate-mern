/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1F3C",
          50: "#EEF1F6",
          600: "#16305A",
          700: "#0E1F3C",
          900: "#081327",
        },
        canvas: "#F7F7F4",
        line: "#E4E4E0",
        accent: {
          DEFAULT: "#0F7A6C",
          50: "#E7F4F1",
          600: "#0C6357",
          700: "#0A5449",
        },
        gold: {
          DEFAULT: "#C89B3C",
          50: "#FBF4E4",
        },
        muted: "#6B7280",
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,31,60,0.06), 0 1px 8px rgba(14,31,60,0.05)",
        cardHover: "0 8px 24px rgba(14,31,60,0.12)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
