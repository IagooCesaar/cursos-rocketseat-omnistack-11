import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

import useAuth from "../../contexts/auth";

export default function Login() {
  const { login, anonimousAccess } = useAuth();
  const navigation = useNavigation();
  async function handleLogin() {
    login();
  }
  async function handleBack() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Voltar" onPress={handleBack} />
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
