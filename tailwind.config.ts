import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"]
      },
      colors: {
        museum: {
          ink: "rgb(var(--museum-ink) / <alpha-value>)",
          paper: "rgb(var(--museum-paper) / <alpha-value>)",
          muted: "rgb(var(--museum-muted) / <alpha-value>)",
          line: "rgb(var(--museum-line) / <alpha-value>)",
          acid: "rgb(var(--museum-acid) / <alpha-value>)",
          ember: "rgb(var(--museum-ember) / <alpha-value>)",
          cyan: "rgb(var(--museum-cyan) / <alpha-value>)"
        }
      },
      boxShadow: {
        glow: "0 0 80px rgba(215,255,88,0.18)",
        glass: "0 24px 90px rgba(0,0,0,0.28)"
      },
      backgroundImage: {
        noise: "url('/noise.svg')"
      }
    }
  },
  plugins: []
};

export default config;
