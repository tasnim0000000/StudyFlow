/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Light-mode named colors (also used as fallbacks) */
        primary: {
          DEFAULT: '#8B5CF6',   /* violet */
          dark: '#7C3AED',
          light: '#C4B5FD',
        },
        secondary: {
          DEFAULT: '#F472B6',   /* hot pink */
          light: '#FBCFE8',
        },
        background: {
          DEFAULT: 'hsl(var(--background))',
          card: 'hsl(var(--card))',
        },
        accent: {
          blue:    '#93C5FD',
          mint:    '#6EE7B7',
          yellow:  '#FCD34D',
          coral:   '#FCA5A5',
          rose:    '#FDA4AF',
          peach:   '#FDBA74',
          sage:    '#86EFAC',
          sky:     '#7DD3FC',
          indigo:  '#A5B4FC',
          amber:   '#FDE68A',
        },
        /* Assignment / note palette — calm distinct hues */
        swatch: {
          coral:   { bg: '#FFE8E0', dark: '#3D1F18' },
          sky:     { bg: '#DFF0FF', dark: '#152536' },
          sage:    { bg: '#DBF4E8', dark: '#153325' },
          lavender:{ bg: '#EDE9FF', dark: '#20183D' },
          amber:   { bg: '#FFF3D4', dark: '#3D2D09' },
          rose:    { bg: '#FFE4EE', dark: '#3D1525' },
          teal:    { bg: '#D5F5F4', dark: '#0F302F' },
          lemon:   { bg: '#FFFAD4', dark: '#3D3709' },
        },

        /* shadcn/radix tokens */
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft:  '0 4px 24px rgba(30,20,60,0.08)',
        glass: '0 8px 32px rgba(139,92,246,0.14)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
