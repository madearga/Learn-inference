import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        surface: "var(--color-surface)",
        muted: {
          foreground: "var(--color-muted-foreground)",
        },
        signal: "var(--color-signal)",
        hairline: "var(--color-hairline)",
      },
      borderColor: {
        hairline: "var(--color-hairline)",
      },
      divideColor: {
        DEFAULT: "var(--color-hairline)",
      },
    },
  },
  plugins: [],
};

export default config;
