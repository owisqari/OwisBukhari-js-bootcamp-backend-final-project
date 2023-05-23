/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('./public/images/wave-haikei.svg')",
        "footer-texture": "url('/public/images/wave-haikei.svg')",
      },
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
