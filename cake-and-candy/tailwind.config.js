/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      // Hier fügen wir benutzerdefinierte Farben hinzu
      colors: {
        'autofill-bg': '#005f5a', // Hintergrundfarbe für Autofill
        'autofill-text': '#fef3c6', // Textfarbe für Autofill
      },
    },
  },
  variants: {
    extend: {
      // Fügen Sie die Autofill-Varianten hinzu
      backgroundColor: ['autofill'],
      textColor: ['autofill'],
    },
  },
  plugins: [require("daisyui")],
}
