/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retro color palette
        'retro-cream': '#f4f1e8',
        'retro-paper': '#efe8d8',
        'retro-sepia': '#d4c4a8',
        'retro-brown': '#8b7355',
        'retro-dark': '#4a3728',
        'retro-rust': '#a65d3f',
        'retro-teal': '#5d7a7a',
        'retro-gold': '#c9a227',
        'retro-red': '#8b3a3a',
        'retro-green': '#4a6741',
      },
      fontFamily: {
        'retro': ['Courier New', 'Courier', 'monospace'],
        'storybook': ['Times New Roman', 'Georgia', 'serif'],
        'display': ['Palatino', 'Palatino Linotype', 'serif'],
      },
      boxShadow: {
        'retro': '4px 4px 0px #8b7355',
        'retro-lg': '6px 6px 0px #4a3728',
        'retro-sm': '2px 2px 0px #8b7355',
        'retro-inset': 'inset 2px 2px 4px rgba(74, 55, 40, 0.3)',
      },
      borderRadius: {
        'retro': '2px',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

