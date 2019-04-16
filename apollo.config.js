module.exports = {
  client: {
    service: {
      name: "lively-web",
      localSchemaFile: "./api/src/schema.graphql"
    },
    includes: ["./www/**/*.{ts,js,tsx}"]
  },
  server: {
    name: "api",
    localSchemaFile: "./api/src/schema.graphql"
  }
};
