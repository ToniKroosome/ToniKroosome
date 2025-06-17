// postcss.config.js
module.exports = {
  plugins: {
    // the Tailwind “PostCSS plugin” (separate from the CLI tool)
    "@tailwindcss/postcss": {},
    // autoprefixer goes last
    autoprefixer: {},
  }
}
