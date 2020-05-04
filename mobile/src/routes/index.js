import React, { useEffect } from "react";
import { View } from "react-native";
import { SplashScreen } from "expo";

import useAuth from "../contexts/auth";

import InitialRoutes from "./initial.routes";
import LoggedRoutes from "./logged.routes";

export default function Routes() {
  const { logged, loading } = useAuth();

  if (loading) return <View></View>;
  if (!loading) SplashScreen.hide();

  return logged ? <LoggedRoutes /> : <InitialRoutes />;
}
