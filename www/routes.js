const makeRouter = require("./makeRouter");
const createRoute = makeRouter.createRoute;

module.exports.classesRoute = createRoute("classes", "/classes/:course_id");
module.exports.classSettings = createRoute(
  "classSettings",
  "/classes/:course_id/settings"
);
module.exports.users = createRoute("users", "/users/:id");
