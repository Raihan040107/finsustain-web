/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        // Tentukan warna aksen oranye dari desain
        'ftech-orange': '#D96D4B', // Perkiraan warna oranye-merah dari gambar
        'ftech-dark': '#303236',   // Perkiraan warna latar belakang gelap utama
        'ftech-medium': '#525459', // Perkiraan warna latar belakang gelap medium
=======
        "ftech-dark": "#2d2d2d",
        "ftech-mid": "#3a3a3a",
        "ftech-card": "rgba(255,255,255,0.07)",
        "ftech-card2": "rgba(255,255,255,0.10)",
        "ftech-border": "rgba(255,255,255,0.12)",
        "ftech-accent": "#e05c2a",
        "ftech-accent-h": "#f06b35",
        "ftech-text": "#f0ece8",
        "ftech-muted": "#b0a89e",
      },
      fontFamily: {
        head: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
>>>>>>> 015e9a275408a351252ab15a6852c65f47ba998d
      },
    },
  },
  plugins: [],
};
