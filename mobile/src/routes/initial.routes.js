import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const InitialStack = createStackNavigator();

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function InitialRoutes() {
  return (
    <InitialStack.Navigator screenOptions={{ headerShown: false }}>
      <InitialStack.Screen name="Home" component={Home} />
      <InitialStack.Screen name="Login" component={Login} />
      <InitialStack.Screen name="Register" component={Register} />
    </InitialStack.Navigator>
  );
}
