/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tavern: {
          // Rich wood browns
          50: '#faf7f3',
          100: '#f5ede0',
          200: '#e8d4b8',
          300: '#d4b88a',
          400: '#c19a5c',
          500: '#a67c52',
          600: '#8b6544',
          700: '#6f4e36',
          800: '#543a28',
          900: '#3d2a1d',
          950: '#1a0f0a', // Very dark brown for dark mode
        },
        amber: {
          // Warm firelight amber
          50: '#fff8e8',
          100: '#ffefcc',
          200: '#ffdf99',
          300: '#ffc966',
          400: '#ffb033',
          500: '#e69900',
          600: '#cc8800',
          700: '#b37700',
          800: '#996600',
          900: '#805500',
        },
        wine: {
          // Deep burgundy/wine reds
          50: '#f5e8e8',
          100: '#ebd1d1',
          200: '#d7a3a3',
          300: '#c37575',
          400: '#af4747',
          500: '#8b3636',
          600: '#6b2a2a',
          700: '#4b1e1e',
          800: '#2b1212',
          900: '#1a0a0a',
        },
        parchment: {
          // Aged paper/cream tones
          50: '#fefcf9',
          100: '#fdf9f3',
          200: '#fbf3e7',
          300: '#f9eddb',
          400: '#f7e7cf',
          500: '#e8d4b8',
          600: '#d4b88a',
          700: '#c19a5c',
          800: '#a67c52',
          900: '#8b6544',
        },
        forest: {
          // Deep forest greens
          50: '#e8f0e8',
          100: '#d1e1d1',
          200: '#a3c3a3',
          300: '#75a575',
          400: '#478747',
          500: '#2d5a2d',
          600: '#234723',
          700: '#193419',
          800: '#0f210f',
          900: '#050e05',
        },
        copper: {
          // Warm copper/rust
          50: '#faf5f0',
          100: '#f5ebe1',
          200: '#ebd7c3',
          300: '#e1c3a5',
          400: '#d7af87',
          500: '#b88a5c',
          600: '#996b4d',
          700: '#7a4c3e',
          800: '#5b2d2f',
          900: '#3c0e20',
        }
      },
      fontFamily: {
        cozy: ['"Cinzel"', 'serif'],
        tavern: ['"MedievalSharp"', 'cursive'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      borderRadius: {
        'cozy': '1.5rem',
        'cozy-lg': '2rem',
      },
      boxShadow: {
        'cozy': '0 4px 14px 0 rgba(166, 124, 82, 0.2)',
        'cozy-lg': '0 8px 24px 0 rgba(166, 124, 82, 0.3)',
        'tavern': '0 4px 14px 0 rgba(139, 101, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}

