import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import api from "../../services/api";
import useAuth from "../../contexts/auth";

import styles from "./styles";
import logo from "../../assets/logo.png";

export default function Register() {
  const navigation = useNavigation();
  const { unauthorized } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  function handleBack() {
    navigation.goBack();
  }
  async function handleRegister() {
    const data = {
      name,
      email,
      password,
      whatsapp,
      city,
      uf,
    };
    let newOng = {};
    try {
      const options = {
        method: "post",
        url: "/ongs",
        data,
      };
      const response = await api(options);
      newOng = response.data[0];
      navigation.goBack();
    } catch (error) {
      Alert.alert("Falha ao cadastrar ONG", error.message);
      if (err?.response?.status === 401) unauthorized();
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={logo} />
          <TouchableOpacity onPress={handleBack}>
            <Feather name="arrow-left" size={28} color="#e82041" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.title}>Cadastre sua ONG</Text>
          <Text style={styles.text}>
            Faça seu cadastro entre na plataforma e ajude pessoas a encontrarem
            ajuda para os casos de suas ONGs
          </Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome da ONG"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCompleteType="name"
            autoCorrect={true}
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
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
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry={true}
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="WhatsApp"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="numeric"
            returnKeyType="next"
          />
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, styles.inputGroupFirst]}
              placeholder="Cidade"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              autoCorrect={true}
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="UF"
              value={uf}
              onChangeText={setUf}
              autoCapitalize="characters"
              autoCorrect={true}
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity style={styles.action} onPress={handleRegister}>
            <Text style={styles.actionText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
