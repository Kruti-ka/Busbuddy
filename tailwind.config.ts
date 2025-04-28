import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "primary-emerald": "#0EA47F",
        "primary-emerald-dark": "#0A8266",
        "primary-emerald-light": "#25C199",
        "accent-teal": "#0B9183",
        "accent-teal-dark": "#086F65",
        "accent-teal-light": "#1DB1A3",
        "base-white": "#FFFFFF",
        "neutral-gray": "#F8FAFB",
        "neutral-gray-dark": "#F1F5F6",
        "neutral-dark": "#1A202C",
        "neutral-text": "#3E4C59",
        "success-green": "#22C55E",
        "warning-amber": "#F59E0B",
        "info-teal": "#14B8A6",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#E8F8F4",
          100: "#D0F1E9",
          200: "#A2E3D3",
          300: "#73D5BD",
          400: "#45C7A7",
          500: "#0EA47F",
          600: "#0A8266",
          700: "#08624C",
          800: "#054133",
          900: "#032119",
          950: "#01100D",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#E6F6F5",
          100: "#CCEDEA",
          200: "#99DCD6",
          300: "#66CAC1",
          400: "#33B9AD",
          500: "#0B9183",
          600: "#086F65",
          700: "#06524B",
          800: "#043632",
          900: "#021B19",
          950: "#010D0C",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-small": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "bounce-small": "bounce-small 1s ease-in-out infinite",
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 0, 0, 0.05)",
        hover: "0 15px 35px rgba(0, 0, 0, 0.1)",
        'elevation-1': '0 2px 5px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0 4px 10px rgba(0, 0, 0, 0.12)',
        'elevation-3': '0 8px 20px rgba(0, 0, 0, 0.15)',
        'glow-primary': '0 0 15px rgba(14, 164, 127, 0.5)',
        'glow-secondary': '0 0 15px rgba(11, 145, 131, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #0EA47F 0%, #25C199 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #0B9183 0%, #1DB1A3 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config