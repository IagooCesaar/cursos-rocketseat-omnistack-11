const OngsRoutes = require("./ongs");
const UtilRoutes = require("./utilRoutes");

function mapRoutes(classInstance, classMethods) {
  return classMethods.map((method) => classInstance[method]());
}

const Routes = [
  ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),
  ...mapRoutes(new OngsRoutes(), OngsRoutes.methods()),
];

module.exports = Routes;
