const OngsRoutes = require("./ongs");

function mapRoutes(classInstance, classMethods) {
  return classMethods.map((method) => classInstance[method]());
}

const Routes = [...mapRoutes(new OngsRoutes(), OngsRoutes.methods())];

module.exports = Routes;
