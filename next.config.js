const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  sassOptions: {
    includePaths: [path.resolve(__dirname, 'sass',)],
    prependData: `@import "./assets/styles/variables.scss";`,
  },
  reactStrictMode: false,
}