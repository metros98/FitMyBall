import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        // FitMyBall dark theme tokens
        surface: {
          slate: '#030712',
          base: '#0c102d',
          card: '#0A1628',
          elevated: '#111D35',
          active: '#1A2744',
          highlight: '#1E3A5F',
        },
        brand: {
          DEFAULT: '#2563EB',
          hover: '#3B82F6',
          active: '#1D4ED8',
          muted: '#1E40AF',
          subtle: '#172554',
        },
        'accent-cyan': {
          DEFAULT: '#22D3EE',
          dim: '#06B6D4',
          bright: '#67E8F9',
          subtle: '#083344',
        },
        match: {
          excellent: '#22C55E',
          good: '#14B8A6',
          fair: '#F59E0B',
          weak: '#64748B',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.3), 0 0 60px rgba(37, 99, 235, 0.1)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3), 0 0 60px rgba(34, 211, 238, 0.1)',
        'glow-cyan-intense': '0 0 15px rgba(34, 211, 238, 0.5), 0 0 45px rgba(34, 211, 238, 0.2), 0 0 80px rgba(34, 211, 238, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 1px rgba(34, 211, 238, 0.1)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse at 50% 50%, #0A1628 0%, #030712 70%)',
        'accent-bar': 'linear-gradient(90deg, #2563EB, #22D3EE)',
        'card-hover-gradient': 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(34, 211, 238, 0.03) 100%)',
        'grid-pattern': 'linear-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'card': '12px',
        'button': '8px',
        'input': '8px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'count-up': 'count-up 600ms ease-out',
        'fade-slide-up': 'fade-slide-up 400ms ease-out',
        'hero-fade-in': 'fade-slide-up 200ms ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
