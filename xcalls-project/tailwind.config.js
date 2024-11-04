module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... باقي درجات اللون
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
