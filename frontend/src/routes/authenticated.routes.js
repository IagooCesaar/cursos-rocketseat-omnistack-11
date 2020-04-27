import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Profile from "../pages/Profile";
import NewIncident from "../pages/NewIncident";

const AuthenticatedRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Redirect exact from="/" to="/profile" />
      <Route path="/profile" component={Profile} />
      <Route path="/incidents/new" component={NewIncident} />
    </Switch>
  </BrowserRouter>
);

export default AuthenticatedRoutes;
