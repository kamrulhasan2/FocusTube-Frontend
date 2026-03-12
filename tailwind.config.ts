import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        zinc: colors.zinc,
        primary: "#4f46e5",
        background: "#020617",
        foreground: "#e2e8f0",
        accent: "#10b981",
      },
    },
  },
  plugins: [],
};

export default config;
