import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cell: "#0A0A0A",
        concrete: "#1C1C1E",
        yard: "#141416",
        chalk: "#E8E4DF",
        dim: "#6B6B6F",
        alarm: "#FF3D00",
        "alarm-muted": "#8A2A0C",
        alive: "#00E676",
        "alive-glow": "#00E67640",
        gold: "#FFD54F",
        "gold-dim": "#B29537",
        steel: "#3A3A3C",
      },
      fontFamily: {
        anton: ["var(--font-anton-var)", "sans-serif"],
        space: ["var(--font-space-mono)", "monospace"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
        caveat: ["var(--font-caveat-var)", "cursive"],
        playfair: ["var(--font-playfair-var)", "serif"],
        marker: ["var(--font-marker)", "cursive"],
        indie: ["var(--font-indie)", "cursive"],
        shadows: ["var(--font-shadows)", "cursive"],
        rock: ["var(--font-rock)", "cursive"],
        "caveat-brush": ["var(--font-caveat-brush)", "cursive"],
        special: ["var(--font-special)", "monospace"],
        vt: ["var(--font-vt)", "monospace"],
      },
      fontSize: {
        "hero-desktop": ["120px", { lineHeight: "1" }],
        "hero-mobile": ["56px", { lineHeight: "1" }],
        "stat-desktop": ["72px", { lineHeight: "1" }],
        "stat-mobile": ["48px", { lineHeight: "1" }],
      },
      letterSpacing: {
        widest: "0.25em",
        editorial: "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
