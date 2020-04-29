import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

import useAuth from "../../contexts/auth";

export default function Home() {
  const { login, anonimousAccess } = useAuth();

  const navigation = useNavigation();

  async function handleLogin() {
    navigation.navigate("Login");
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
