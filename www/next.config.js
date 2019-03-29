const withTypescript = require("@zeit/next-typescript");

const prod = process.env.NODE_ENV === "production";

module.exports = withTypescript({
  env: {
    API_URL: prod ? "https://api.lively.im" : "http://localhost:4000"
  }
});
