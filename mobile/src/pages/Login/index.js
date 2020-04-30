import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import useAuth from "../../contexts/auth";

import logo from "../../assets/logo.png";
import styles from "./styles";

export default function Login() {
  const { login, anonimousAccess } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  function handleLogin() {
    login(email, password);
  }
  function handleBack() {
    navigation.goBack();
  }
  function handleRegister() {
    navigation.navigate("Register", {});
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={logo} />
            <TouchableOpacity onPress={handleBack}>
              <Feather name="arrow-left" size={28} color="#e82041" />
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <Text style={styles.title}>Faça seu logon</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail cadastrado"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCompleteType="email"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={true}
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="go"
            />
            <TouchableOpacity style={styles.action} onPress={handleLogin}>
              <Text style={styles.actionText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionLink}
              onPress={handleRegister}
            >
              <Feather name="log-in" size={28} color="#e82041" />
              <Text style={styles.actionLinkText}>Não tenho cadastro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
