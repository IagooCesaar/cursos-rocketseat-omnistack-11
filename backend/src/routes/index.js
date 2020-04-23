const OngsRoutes = require("./ongs");
const IncidentsRoutes = require("./incidents");
const SessionRoutes = require("./session");
const UtilRoutes = require("./utilRoutes");

function mapRoutes(classInstance, classMethods) {
  return classMethods.map((method) => classInstance[method]());
}

const Routes = [
  ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),
  ...mapRoutes(new OngsRoutes(), OngsRoutes.methods()),
  ...mapRoutes(new IncidentsRoutes(), IncidentsRoutes.methods()),
  ...mapRoutes(new SessionRoutes(), SessionRoutes.methods()),
];

module.exports = Routes;
