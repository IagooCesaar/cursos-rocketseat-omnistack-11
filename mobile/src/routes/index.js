import React from "react";

import useAuth from "../contexts/auth";

import InitialRoutes from "./initial.routes";
import LoggedRoutes from "./logged.routes";

export default function Routes() {
  const { logged } = useAuth();
  return logged ? <LoggedRoutes /> : <InitialRoutes />;
}
