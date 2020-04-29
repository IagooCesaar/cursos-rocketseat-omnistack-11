import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const InitialStack = createStackNavigator();

import Login from "../pages/Login";

export default function InitialRoutes() {
  return (
    <InitialStack.Navigator screenOptions={{ headerShown: false }}>
      <InitialStack.Screen name="Login" component={Login} />
    </InitialStack.Navigator>
  );
}
