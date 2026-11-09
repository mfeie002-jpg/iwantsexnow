import type { Config } from "tailwindcss";

const COOL = {
  50: "#f2f7f6",
  100: "#e2eeec",
  200: "#ccdddb",
  300: "#a9c3c0",
  400: "#86a4a2",
  500: "#668582",
  600: "#4d6a6a",
  700: "#34504f",
  800: "#1d3a42",
  900: "#102830",
  950: "#0a171d",
};

const glow = {
  50: "#fff1ee", 100: "#ffe2dc", 200: "#ffc6bb", 300: "#ffa393", 400: "#ff8472",
  500: "#ff6b5e", 600: "#e8564a", 700: "#c4443a", 800: "#a8382e", 900: "#7a3028", 950: "#5a2a24",
};
const sun = {
  50: "#fff8ec", 100: "#ffeed0", 200: "#ffdca3", 300: "#ffc977", 400: "#ffb067",
  500: "#ff9a45", 600: "#e07f2c", 700: "#b86220", 800: "#8a4a1a", 900: "#613416", 950: "#3a1f0e",
};
const dusk = {
  50: "#f3f1ff", 100: "#e6e2ff", 200: "#cdc6ff", 300: "#aea3ff", 400: "#8a7bff",
  500: "#6f60f0", 600: "#5a4cd0", 700: "#4739a8", 800: "#352c80", 900: "#262058", 950: "#181436",
};
const mint = {
  50: "#ecfdf7", 100: "#d3f9ec", 200: "#a8f0d9", 300: "#78e3c4", 400: "#4fd1b0",
  500: "#2fb897", 600: "#229a7d", 700: "#1d7b66", 800: "#1b6152", 900: "#194f44", 950: "#0a2e28",
};
const lake = {
  50: "#eef9fc", 100: "#d5f0f7", 200: "#aee1ee", 300: "#7ccbe0", 400: "#4aaecb",
  500: "#2b92b3", 600: "#227796", 700: "#1e6079", 800: "#1d4e62", 900: "#1b4151", 950: "#0d2a36",
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
        sans: ["Hanken Grotesk", "system-ui", "Helvetica", "Arial", "sans-serif"],
        mono: ["Hanken Grotesk", "system-ui", "Helvetica", "Arial", "sans-serif"],
        serif: ["Archivo", "Hanken Grotesk", "Arial", "sans-serif"],
        display: ["Archivo", "Hanken Grotesk", "Arial", "sans-serif"],
      },
      colors: {
        nacht: "#07141a",
        tiefsee: "#0d1f27",
        fels: "#143039",
        linie: "#1d4350",
        gletscher: "#f2f7f6",
        nebel: "#9fb8b5",
        glueh: "#ff6b5e",
        bernstein: "#ffb067",
        lago: "#4fd1b0",
        papier: "#f2f7f6",
        tinte: "#0b2229",
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
