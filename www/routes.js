const makeRouter = require("./makeRouter");
const createRoute = makeRouter.createRoute;

module.exports.classesRoute = createRoute("classes", "/classes/:course_id");
module.exports.classSettings = createRoute(
  "classSettings",
  "/classes/:course_id/settings"
);
module.exports.classFiles = createRoute(
  "classFiles",
  "/classes/:class_id/files/:file_id"
);
module.exports.classUnits = createRoute(
  "unit",
  "/classes/:class_id/units/:unit_id"
);
module.exports.editUnits = createRoute("editUnits", "/classes/:class_id/edit");
module.exports.users = createRoute("users", "/users/:id");
