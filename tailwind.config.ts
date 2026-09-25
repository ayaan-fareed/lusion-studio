import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#F5F5F7",
          dark: "#0A0A0C",
          "case-study": "#F2E6E6",
        },
        accent: {
          blush: "#F2E6E6",
          cyan: "#2DE2E6",
        },
        primary: {
          light: "#111111",
          dark: "#FFFFFF",
        },
        secondary: {
          light: "#707072",
          dark: "#86868B",
        },
        border: {
          "subtle-light": "rgba(0, 0, 0, 0.08)",
          "subtle-dark": "rgba(255, 255, 255, 0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      maxWidth: {
        "7xl": "1280px",
      },
      borderRadius: {
        card: "16px",
        "card-lg": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
