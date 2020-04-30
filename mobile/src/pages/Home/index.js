import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import useAuth from "../../contexts/auth";

import styles from "./styles";
import logoImg from "../../assets/logo.png";
import heroesImg from "../../assets/heroes.png";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image source={logoImg} style={styles.logo} />
          <Image source={heroesImg} style={styles.heroesLogo} />
        </View>
        <View style={styles.apresentation}>
          <Text
            style={[styles.apresentationText, styles.apresentationTextBold]}
          >
            Seja o herói ou heroína e ajude uma ONG
          </Text>
          <Text style={styles.apresentationText}>
            Sua ajuda poderá fazer a diferença no dia-a-dia de muitas pessoas
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleAnonimousAcess}
            style={styles.action}
          >
            <Text style={styles.actionText}>Quero ajudar!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.action, styles.secundaryAction]}
          >
            <Text style={styles.actionText}>Sou uma ONG</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
