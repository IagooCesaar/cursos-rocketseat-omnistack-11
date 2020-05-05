import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";
import { YellowBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SplashScreen } from "expo";

import { AuthProvider } from "./src/contexts/auth";
import Routes from "./src/routes";

YellowBox.ignoreWarnings([
  "Non-serializable values were found in the navigation state",
]);

export default function App() {
  SplashScreen.preventAutoHide();
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
