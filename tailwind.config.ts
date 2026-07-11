import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2A20",
        paper: "#F5F7F1",
        moss: "#1F3A2E",
        mossLight: "#2E5240",
        amber: "#D9A441",
        amberDeep: "#B9832A",
        sand: "#E7E7DC",
        line: "#D6D9CB",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
