/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Module-specific colors
        communication: {
          light: '#4361EE',
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        student: {
          light: '#10B981',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        content: {
          light: '#8B5CF6',
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
        },
        enrollment: {
          light: '#F59E0B',
          DEFAULT: '#D97706',
          dark: '#B45309',
        },
        
        // Semantic colors
        success: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        warning: {
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        error: {
          light: '#F87171',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        info: {
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        
        // Neutral colors
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        
        // Legacy color support
        primary: 'var(--color-student-main)',
        'primary-foreground': 'white',
        secondary: 'var(--color-student-light)',
        'secondary-foreground': 'white',
        accent: 'var(--color-student-dark)',
        'accent-foreground': 'white',
        background: 'var(--color-neutral-50)',
        foreground: 'var(--color-neutral-900)',
        muted: 'var(--color-neutral-100)',
        'muted-foreground': 'var(--color-neutral-500)',
        border: 'var(--color-neutral-200)',
        input: 'var(--color-neutral-300)',
        ring: 'var(--color-student-light)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
