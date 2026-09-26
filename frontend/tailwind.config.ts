import type { Config } from 'tailwindcss';

// Tokens mirror docs/design-guidelines.md §1 — keep both in sync.
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0369A1',
          hover: '#075985',
        },
        secondary: '#0EA5E9',
        accent: '#16A34A',
        surface: '#FFFFFF',
        muted: '#64748B',
        border: '#E2E8F0',
        destructive: '#DC2626',
        status: {
          pending: { bg: '#FEF3C7', text: '#92400E' },
          viewed: { bg: '#E0F2FE', text: '#075985' },
          interview: { bg: '#EDE9FE', text: '#5B21B6' },
          approved: { bg: '#DCFCE7', text: '#166534' },
          rejected: { bg: '#FEE2E2', text: '#991B1B' },
        },
      },
      backgroundColor: {
        page: '#F8FAFC',
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)', 'var(--font-noto-sans)', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
