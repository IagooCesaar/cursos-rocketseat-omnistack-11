import React from "react";

import useAuth from "../contexts/auth";

import AnonimousRoutes from "./anonimous.routes";
import AuthenticatedRoutes from "./authenticated.routes";

export default function Routes() {
  const { authenticated, loading } = useAuth();

  return authenticated ? <AuthenticatedRoutes /> : <AnonimousRoutes />;
}
