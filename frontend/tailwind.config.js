/** @type {import('tailwindcss').Config} */
export default {
  // Указываем пути ко всем файлам, где будут использоваться классы Tailwind
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Здесь можно добавлять свои цвета, шрифты, отступы и анимации
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}