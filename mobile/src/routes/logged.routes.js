import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const LoggedStack = createStackNavigator();

import Incidents from "../pages/Incidents";
import Detail from "../pages/Detail";

export default function LoggedRoutes() {
  return (
    <LoggedStack.Navigator screenOptions={{ headerShown: false }}>
      <LoggedStack.Screen name="Incidents" component={Incidents} />
      <LoggedStack.Screen name="Detail" component={Detail} />
    </LoggedStack.Navigator>
  );
}
