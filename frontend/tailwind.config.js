/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        nav: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        apex: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          100: '#f5f5f7',
          50: '#fafafa',
        }
      },
      letterSpacing: {
        tightest: '-.075em',
        widest: '.2em',
      },
      transitionDuration: {
        '2000': '2000ms',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}
