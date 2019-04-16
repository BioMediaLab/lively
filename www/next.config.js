const withTypescript = require("@zeit/next-typescript");
const withCSS = require("@zeit/next-css");

const prod = process.env.NODE_ENV === "production";

module.exports = withCSS(
  withTypescript({
    env: {
      API_URL: prod ? "https://api.lively.im" : "http://localhost:4000"
    }
  })
);
