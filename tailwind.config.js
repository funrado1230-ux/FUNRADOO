/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color Combos & Practice Tokens
        primary: {
          DEFAULT: "#E05A47", // Coral Primary
          foreground: "#FFFDF9", // Primary text over Coral (Cream White)
          dark: "#C84836",
          light: "#F8ECE9"
        },
        foreground: {
          DEFAULT: "#2C1E1A", // Cocoa Body Text & Add to Cart button
          muted: "#665753"
        },
        background: {
          DEFAULT: "#FAF7F2", // Cream Background
          card: "#FFFFFF",
          sand: "#F4EEE5"
        },
        coral: {
          DEFAULT: "#E05A47", // Coral
          dark: "#C84836",
          light: "#F8ECE9"
        },
        cocoa: {
          DEFAULT: "#2C1E1A", // Cocoa
          dark: "#1E1411",
          light: "#4A3731"
        },
        cream: {
          DEFAULT: "#FAF7F2", // Cream
          sand: "#F4EEE5",
          light: "#FFFDF9"
        },
        accent: {
          DEFAULT: "#F59E0B", // Amber Accent
          glow: "#FBBF24",
          light: "#FEF3C7",
          dark: "#D97706"
        },
        mint: {
          DEFAULT: "#10B981", // Mint Success (WhatsApp)
          dark: "#059669",
          light: "#D1FAE5",
          glow: "#34D399"
        },
        brand: {
          burgundy: "#8B1527",
          burgundyDark: "#6B0D1B",
          burgundyLight: "#A52136",
          roseTint: "#FBF3F4",
          cream: "#FAF7F2",
          sand: "#F5F2EB",
          obsidian: "#141414",
          charcoal: "#2C1E1A",
          muted: "#666666",
          gold: "#F59E0B",
          goldLight: "#F8F1E5"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(224, 90, 71, 0.08)',
        'premium': '0 20px 40px -15px rgba(44, 30, 26, 0.07)',
        'drawer': '-10px 0 40px rgba(0, 0, 0, 0.15)',
        'mint': '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
        'coral': '0 10px 25px -5px rgba(224, 90, 71, 0.35)',
      }
    },
  },
  plugins: [],
}
