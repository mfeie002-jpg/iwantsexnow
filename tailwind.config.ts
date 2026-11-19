import type { Config } from "tailwindcss";

const COOL = {
  50: "#f7f7fb", 100: "#efeff6", 200: "#e1e1ec", 300: "#c9c9db", 400: "#9c9dba",
  500: "#73759a", 600: "#565980", 700: "#3f4268", 800: "#2b2e54", 900: "#1e2247", 950: "#141735",
};

/* cherry */
const glow = {
  50: "#fff0f3", 100: "#ffdde5", 200: "#ffbfce", 300: "#ff94ac", 400: "#f7627f",
  500: "#e8395e", 600: "#d92b52", 700: "#b51e42", 800: "#8f1935", 900: "#6e162e", 950: "#430a1b",
};
/* butter / amber */
const sun = {
  50: "#fffbea", 100: "#fff3c4", 200: "#ffe48a", 300: "#ffd34d", 400: "#ffc21f",
  500: "#f5a800", 600: "#cc8400", 700: "#9c6300", 800: "#744a05", 900: "#523606", 950: "#2d1c00",
};
/* lilac */
const dusk = {
  50: "#f6f3fe", 100: "#ece6fc", 200: "#dcd3f7", 300: "#c3b5f0", 400: "#a590e6",
  500: "#876dd8", 600: "#6c50c2", 700: "#553ca0", 800: "#413081", 900: "#2f2360", 950: "#1b1438",
};
/* mint green */
const mint = {
  50: "#eefbf5", 100: "#d6f5e7", 200: "#bfebd6", 300: "#93dbba", 400: "#5ec59b",
  500: "#2faa7e", 600: "#1e8a64", 700: "#176d50", 800: "#145741", 900: "#114636", 950: "#08271e",
};
/* sky blue */
const lake = {
  50: "#f0f7ff", 100: "#dfeefe", 200: "#c6dffa", 300: "#98c6f5", 400: "#62a5eb",
  500: "#3b86dc", 600: "#2a68bd", 700: "#245398", 800: "#20447a", 900: "#1f3a63", 950: "#12223d",
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", "system-ui", "Helvetica", "Arial", "sans-serif"],
        mono: ["Figtree", "system-ui", "Helvetica", "Arial", "sans-serif"],
        serif: ["Bricolage Grotesque", "Figtree", "Arial", "sans-serif"],
        display: ["Bricolage Grotesque", "Figtree", "Arial", "sans-serif"],
        hand: ["Caveat", "Bradley Hand", "cursive"],
      },
      colors: {
        /* roles kept from the previous system, re-pointed to the light palette */
        nacht: "#fbfaf8",
        tiefsee: "#ffffff",
        fels: "#f1f0f6",
        linie: "#e1e1ec",
        gletscher: "#1e2247",
        nebel: "#5b5f84",
        glueh: "#d92b52",
        bernstein: "#f5a800",
        lago: "#1e8a64",
        papier: "#fbfaf8",
        tinte: "#1e2247",
        kirsche: { DEFAULT: "#d92b52", tief: "#a81c3d" },
        butter: "#ffe48a",
        blush: "#ffd3dc",
        minze: "#bfebd6",
        himmel: "#c6dffa",
        flieder: "#dcd3f7",
        glow,
        sun,
        dusk,
        mint,
        lake,
        gray: COOL,
        stone: COOL,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
