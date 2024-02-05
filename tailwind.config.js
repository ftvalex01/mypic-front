/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'peach-pink': '#fd9491',
        'pink-red': '#ff496f',
        'burgundy': '#642a36',
        'amber-orange': '#faa531',
        'peach-yellow': '#fcb452',
        'corn-yellow': '#fbc36e',
        'teal-green': '#5a9889',
        'mint-green': '#9bc4b3',
      },
     /*  gridTemplateColumns:{
        'x': 'repeat(3, minmax(0, 0.50fr))'
      } */
    },
  },
  plugins: [],
}

