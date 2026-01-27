import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors using CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      borderRadius: {
        'sm': 'var(--radius-sm, 0.125rem)',
        'DEFAULT': 'var(--radius, 0.375rem)',
        'md': 'calc(var(--radius, 0.375rem) - 2px)',
        'lg': 'var(--radius-lg, 0.5rem)',
        'xl': 'var(--radius-xl, 0.75rem)',
        '2xl': 'var(--radius-2xl, 1rem)',
        '3xl': 'var(--radius-3xl, 1.5rem)',
        'full': 'var(--radius-full, 9999px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'in': 'in 0.2s ease-out',
        'out': 'out 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-out',
        'zoom-in': 'zoomIn 0.2s ease-out',
        'zoom-out': 'zoomOut 0.2s ease-out',
        'slide-in-from-top': 'slideInFromTop 0.2s ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 0.2s ease-out',
        'slide-in-from-left': 'slideInFromLeft 0.2s ease-out',
        'slide-in-from-right': 'slideInFromRight 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'in': {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'out': {
          from: {
            opacity: '1',
            transform: 'scale(1)',
          },
          to: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
        },
        'fadeIn': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fadeOut': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'zoomIn': {
          from: { transform: 'scale(0.95)' },
          to: { transform: 'scale(1)' },
        },
        'zoomOut': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(0.95)' },
        },
        'slideInFromTop': {
          from: {
            transform: 'translateY(-8px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'slideInFromBottom': {
          from: {
            transform: 'translateY(8px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'slideInFromLeft': {
          from: {
            transform: 'translateX(-8px)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slideInFromRight': {
          from: {
            transform: 'translateX(8px)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },
      // Add z-index utilities
      zIndex: {
        'modal': 'var(--z-modal, 1000)',
        'popover': 'var(--z-popover, 100)',
        'tooltip': 'var(--z-tooltip, 10)',
        'dropdown': 'var(--z-dropdown, 50)',
      },
      // Add spacing scale using CSS variables
      spacing: {
        'unit': 'var(--spacing-unit, 1rem)',
        'compact': 'var(--spacing-compact, 0.75rem)',
        'header': 'var(--header-height, 64px)',
        'sidebar': 'var(--sidebar-width, 256px)',
        'sidebar-collapsed': 'var(--sidebar-collapsed-width, 64px)',
      },
      // Add font size scale using CSS variables
      fontSize: {
        'small': 'var(--font-size-small, 14px)',
        'base': 'var(--font-size-base, 16px)',
        'large': 'var(--font-size-large, 18px)',
      },
      // Add box shadow scale using CSS variables
      boxShadow: {
        'sm': 'var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
        'DEFAULT': 'var(--shadow, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))',
        'md': 'var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))',
        'lg': 'var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))',
        'xl': 'var(--shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1))',
        '2xl': 'var(--shadow-2xl, 0 25px 50px -12px rgb(0 0 0 / 0.25))',
        'inner': 'var(--shadow-inner, inset 0 2px 4px 0 rgb(0 0 0 / 0.05))',
        'none': 'var(--shadow-none, none)',
      },
      // Add animation duration using CSS variables
      transitionDuration: {
        'fast': 'calc(var(--animation-duration, 0.3s) * 0.5)',
        'DEFAULT': 'var(--animation-duration, 0.3s)',
        'slow': 'calc(var(--animation-duration, 0.3s) * 2)',
      },
      animationDuration: {
        'fast': 'calc(var(--animation-duration, 0.3s) * 0.5)',
        'DEFAULT': 'var(--animation-duration, 0.3s)',
        'slow': 'calc(var(--animation-duration, 0.3s) * 2)',
      },
      // Add transition timing using CSS variables
      transitionTimingFunction: {
        'DEFAULT': 'var(--animation-timing, cubic-bezier(0.4, 0, 0.2, 1))',
        'in-out': 'var(--animation-timing, cubic-bezier(0.4, 0, 0.2, 1))',
      },
      // Add animation timing using CSS variables
      animationTimingFunction: {
        'DEFAULT': 'var(--animation-timing, cubic-bezier(0.4, 0, 0.2, 1))',
        'in-out': 'var(--animation-timing, cubic-bezier(0.4, 0, 0.2, 1))',
      },
      // Add grid columns using CSS variables
      gridTemplateColumns: {
        '12': 'repeat(var(--grid-columns, 12), minmax(0, 1fr))',
      },
      // Add gap using CSS variables
      gap: {
        'grid': 'var(--grid-gap, 1rem)',
      },
      // Add width/height using CSS variables
      width: {
        'sidebar': 'var(--sidebar-width, 256px)',
        'sidebar-collapsed': 'var(--sidebar-collapsed-width, 64px)',
      },
      height: {
        'header': 'var(--header-height, 64px)',
      },
      minHeight: {
        'header': 'var(--header-height, 64px)',
      },
      // Add max-width containers
      maxWidth: {
        'container-sm': '36rem',  // 576px
        'container-md': '48rem',  // 768px
        'container-lg': '64rem',  // 1024px
        'container-xl': '80rem',  // 1280px
        'container-2xl': '96rem', // 1536px
      },
    },
  },
  plugins: [],
}

export default config