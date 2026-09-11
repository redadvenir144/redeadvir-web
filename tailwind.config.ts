import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Azul de marca — más vibrante para fondo oscuro
        brand: {
          50: '#EBF3FB',
          100: '#D7E7F7',
          200: '#AFCFEF',
          300: '#87B7E7',
          400: '#5F9FDF',
          500: '#3787D7',
          600: '#1C63AC', // Base
          700: '#164D86',
          800: '#103760',
          900: '#0A213A',
        },
        // Rojo live — RESERVADO EXCLUSIVAMENTE para estado en directo
        live: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          light: '#FCA5A5',
          glow: 'rgba(239, 68, 68, 0.4)',
        },
        // Tema TV — fondos azul oscuro (estilo REDE ADVIR)
        tv: {
          bg: '#0a1628',           // Fondo principal (azul muy oscuro)
          card: '#0f2140',         // Cards y superficies
          elevated: '#142a4d',     // Elementos elevados
          border: '#1e3a5f',       // Bordes sutiles
          hover: '#1a3354',        // Hover en cards
        },
        // Superficies para tema oscuro azul
        surface: {
          DEFAULT: '#0f2140',
          subtle: '#142a4d',
          muted: '#1a3354',
          border: '#1e3a5f',
        },
        // Texto para fondo oscuro
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
          inverse: '#0a0a0f',
        },
        // Acentos adicionales
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
        },
      },
      // Escala tipográfica — más bold para TV
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Radios consistentes
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px',
      },
      // Sombras para tema oscuro + glow effects
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'none': 'none',
        // Glow effects para TV
        'glow': '0 0 20px rgba(28, 99, 172, 0.3)',
        'glow-brand': '0 0 30px rgba(28, 99, 172, 0.4)',
        'glow-live': '0 0 20px rgba(239, 68, 68, 0.4)',
      },
      // Espaciado adicional
      spacing: {
        '11': '2.75rem',
      },
      // Ring para foco visible
      ringWidth: {
        DEFAULT: '2px',
      },
      ringColor: {
        DEFAULT: '#3787D7',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      ringOffsetColor: {
        DEFAULT: '#0a1628',
      },
      // Animaciones
      animation: {
        'pulse-live': 'pulse-live 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(28, 99, 172, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(28, 99, 172, 0.5)' },
        },
      },
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
