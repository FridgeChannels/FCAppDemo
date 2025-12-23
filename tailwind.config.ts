import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        "brand-serif": ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Player-specific colors
        player: {
          text: {
            primary: "hsl(var(--text-primary))",
            secondary: "hsl(var(--text-secondary))",
            muted: "hsl(var(--text-muted))",
            light: "hsl(var(--text-on-dark))",
          },
          progress: {
            track: "hsla(40, 50%, 30%, 0.4)",
            fill: "hsl(40, 20%, 95%)",
          },
        },
        // Episode list colors (dark theme)
        list: {
          bg: "hsl(var(--list-bg))",
          item: "hsl(var(--list-item-bg))",
          hover: "hsl(var(--list-item-hover))",
          text: {
            primary: "hsl(var(--list-text-primary))",
            secondary: "hsl(var(--list-text-secondary))",
          },
          accent: "hsl(var(--list-accent))",
        },
      },
      borderRadius: {
        none: "5px",
        sm: "5px",
        DEFAULT: "5px",
        md: "5px",
        lg: "5px",
        xl: "5px",
        "2xl": "5px",
        "3xl": "5px",
        full: "5px",
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
        "slide-up-fade": {
          from: { 
            transform: "translateY(20px)", 
            opacity: "0" 
          },
          to: { 
            transform: "translateY(0)", 
            opacity: "1" 
          },
        },
        "scale-in": {
          from: { 
            transform: "scale(0.95)", 
            opacity: "0" 
          },
          to: { 
            transform: "scale(1)", 
            opacity: "1" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.2s ease-out",
      },
      boxShadow: {
        "player-control": "0 4px 20px hsla(0, 0%, 0%, 0.15)",
        "player-card": "0 8px 32px hsla(0, 0%, 0%, 0.12)",
        "list-item": "0 2px 8px hsla(0, 0%, 0%, 0.3)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
