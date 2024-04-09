// @ts-ignore
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette"

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"))
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  )

  addBase({
    ":root": newVars,
  })
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      animation: {
        bzz: "bzz 0.8s ease-out",
      },
      fontFamily: {
        "serif-heading": [
          "MinecraftTen",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "MinecraftSeven",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        background: "#171615",
        foreground: "#EDE5E2",
        "muted-foreground": "#ABA09C",
        card: "#111111",
        border: "#3D3938",

        accent: "#3C8527",
        "accent-light": "#52A535",
        "accent-dark": "#2A641C",

        warning: "#FFDC16",

        destructive: "#852727",
        "destructive-light": "#A53535",
        "destructive-dark": "#641C1C",
      },
      keyframes: {
        bzz: {
          "0%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
}
