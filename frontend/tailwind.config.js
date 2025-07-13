/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
   
extend: {
  colors: {
    'neon-blue': '#3fefef',
    'bolt-purple': '#c084fc',
  },
  animation: {
    'fade-in': 'fadeIn 0.8s ease-in-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
  },
}
  },
  plugins: [],
}

