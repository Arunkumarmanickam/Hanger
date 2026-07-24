/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hanger: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a2e',
          hover: '#252540',
          accent: '#00f5d4',
          accent2: '#7b2ffc',
          text: '#e0e0e8',
          muted: '#8888a0',
          border: '#2a2a40',
        },
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
