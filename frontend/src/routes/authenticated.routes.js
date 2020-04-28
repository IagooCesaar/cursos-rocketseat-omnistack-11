import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Profile from "../pages/Profile";
import Register from "../pages/Register";
import NewIncident from "../pages/NewIncident";

const AuthenticatedRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/profile" component={Profile} />
      <Route
        path="/incidents/new"
        render={(props) => <NewIncident {...props} action="new" />}
      />
      <Route
        path="/incidents/edit/:incident_id"
        render={(props) => <NewIncident {...props} action="edit" />}
      />
      <Route
        path="/register/edit"
        render={(props) => <Register {...props} action="edit" />}
      />
      <Redirect from="*" to="/profile" />
    </Switch>
  </BrowserRouter>
);

export default AuthenticatedRoutes;
