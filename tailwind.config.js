/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'peach-pink': '#fd9491',
        'pink-red': '#ff496f',
        'amber-orange': '#faa531',
        'peach-yellow': '#fcb452',
        'corn-yellow': '#fbc36e',
        'teal-green': '#5a9889',
        'mint-green': '#9bc4b3',
        'bittersweet': '#fe5f55',
        'burgundy': '#841c26',
        'misty-rose':'#ffebeb',
        'magnolia':'#f7f1f9',
        'white': '#ffffff',
        'rose': '#ef476f',
        'dark-green':'#70e000',
        'black': '#0B090A',
        'eerieBlack': '#161A1D',
        'darkSienna': '#660708',
        'rosewood': '#A4161A',
        'bulgarianRose': '#BA181B',
        'fireEngineRed': '#E5383B',
        'silverPink': '#B1A7A6',
        'lightGray': '#D3D3D3',
        'cultured': '#F5F3F4',        
      },
     /*  gridTemplateColumns:{
        'x': 'repeat(3, minmax(0, 0.50fr))'
      } */
    },
  },
  plugins: [],
}

