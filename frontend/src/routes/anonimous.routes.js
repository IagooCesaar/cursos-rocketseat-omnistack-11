import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Logon from "../pages/Logon";
import Register from "../pages/Register";

const AnonimousRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Logon} />
      <Route path="/register" component={Register} />
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>
);

export default AnonimousRoutes;
