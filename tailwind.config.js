/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          cream: 'var(--color-vintage-cream)',
          beige: 'var(--color-vintage-beige)',
          brown: 'var(--color-vintage-brown)',
          'dark-brown': 'var(--color-vintage-dark-brown)',
          coffee: 'var(--color-vintage-coffee)',
          gold: 'var(--color-vintage-gold)',
          sepia: 'var(--color-vintage-sepia)',
          rust: 'var(--color-vintage-rust)',
          sage: 'var(--color-vintage-sage)',
          charcoal: 'var(--color-vintage-charcoal)',
          surface: 'var(--color-surface)',
          border: 'var(--color-border)',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
