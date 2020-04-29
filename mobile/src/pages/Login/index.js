import React from "react";
import { StyleSheet, View, Button } from "react-native";

import useAuth from "../../contexts/auth";

export default function Login() {
  const { login, anonimousAccess } = useAuth();
  async function handleLogin() {
    login();
  }
  async function handleAnonimousAcess() {
    anonimousAccess();
  }

  return (
    <View style={styles.container}>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Anonimous" onPress={handleAnonimousAcess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
