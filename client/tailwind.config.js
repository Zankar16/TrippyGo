/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {

        /* Nature UI Palette */
        theme: {
          cream: "#F2EAD8",
          sand: "#D9C9AD",
          lightSage: "#B2C3A0",
          sage: "#7E9A6B",
          forest: "#3D5D3D",
        },

        /* Primary (Blue system palette) */
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },

        /* Accent */
        accent: {
          light: "#fbbf24",
          DEFAULT: "#f59e0b",
          dark: "#b45309",
        },

        /* Premium / Dark UI */
        premium: {
          dark: "#0f172a",
          card: "#1e293b",
          glass: "rgba(255,255,255,0.05)",
        }

      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      backdropBlur: {
        xs: "2px",
      },

      boxShadow: {
        premium: "0 8px 32px rgba(0,0,0,0.37)",
      },

      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },

      keyframes: {

        "gradient-x": {
          "0%, 100%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "left center",
          },
          "50%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "right center",
          },
        },

        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

      },

    },
  },

  plugins: [],
}