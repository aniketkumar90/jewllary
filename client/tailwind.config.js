/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#07180F',
          800: '#0B2216', // Primary Deep Forest Green
          700: '#0F2E1E',
          600: '#143C28',
          500: '#1A4D34',
        },
        olive: {
          900: '#112217',
          800: '#173021', // Dark Olive Green
          700: '#1E3E2B',
          600: '#264E37',
        },
        gold: {
          100: '#FBF5E8',
          200: '#F4E7CC',
          300: '#EED7A1',
          400: '#DFBE82',
          500: '#D4AF37', // Champagne Gold Accent
          600: '#B89325',
          700: '#947417',
          800: '#73580F',
        },
        ivory: {
          DEFAULT: '#FAF8F5',
          50: '#FDFCFB',
          100: '#FAF8F5', // Warm White / Ivory
          200: '#F4EFEB',
          300: '#EDE4DC',
          400: '#E3D6C9',
        },
        charcoal: {
          900: '#101012',
          800: '#18181B',
          700: '#27272A',
          600: '#3F3F46',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.28em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(11, 34, 22, 0.12)',
        'luxury-hover': '0 30px 60px -15px rgba(11, 34, 22, 0.22)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        }
      }
    },
  },
  plugins: [],
}
