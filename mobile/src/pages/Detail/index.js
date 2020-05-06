import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Text,
  TextInput,
  CheckBox,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";

import useAuth from "../../contexts/auth";
import api from "../../services/api";

import logoImg from "../../assets/logo.png";
import styles from "./styles";

export default function Detail() {
  const { ong, authenticated, unauthorized } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const incident = route.params?.incident;
  const editing = route.params.editing;
  const message =
    `Olá ${incident?.name}, ` +
    `estou entrando em contato pois gostaria de ajudar no caso "${incident?.title}" ` +
    `com o valor de ${Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(incident?.value)}`;

  function navigateBack(newIncident = null, editing = false) {
    navigation.navigate("Incidents", { newIncident, editing });
  }

  function sendMail() {
    MailComposer.composeAsync({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.email],
      body: message,
    });
  }

  function sendWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${incident.whatsapp}&text=${message}`
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <TouchableOpacity onPress={() => navigateBack()}>
          <Feather name="arrow-left" size={28} color="#e82041" />
        </TouchableOpacity>
      </View>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {authenticated ? (
            <EditBox
              incident={incident}
              editing={editing}
              handleNavigateBack={navigateBack}
            />
          ) : (
            <>
              <ViewBoxData incident={incident} />
              <ContactBox sendWhatsapp={sendWhatsapp} sendMail={sendMail} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const ContactBox = ({ sendWhatsapp, sendMail }) => (
  <View style={styles.contactBox}>
    <Text style={styles.heroTitle}>Salve o dia!</Text>
    <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>

    <Text style={styles.heroDescription}>Entre em contato</Text>

    <View style={styles.multipleActions}>
      <TouchableOpacity style={styles.multipleAction} onPress={sendWhatsapp}>
        <Text style={styles.actionText}>WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.multipleAction} onPress={sendMail}>
        <Text style={styles.actionText}>E-mail</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ViewBoxData = ({ incident }) => (
  <View style={styles.incident}>
    <Text style={[styles.incidentProperty, { marginTop: 0 }]}>ONG:</Text>
    <Text style={styles.incidentValue}>
      {incident.name} ({incident.city}/{incident.uf})
    </Text>

    <Text style={styles.incidentProperty}>Caso:</Text>
    <Text style={styles.incidentValue}>{incident.title}</Text>

    <Text style={styles.incidentProperty}>Descrição:</Text>
    <Text style={styles.incidentValue}>{incident.description}</Text>

    <Text style={styles.incidentProperty}>VALOR:</Text>
    <Text style={styles.incidentValue}>
      {Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(incident.value)}
    </Text>
  </View>
);

const EditBox = ({ incident, editing, handleNavigateBack }) => {
  const { ong, unauthorized } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("0");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (incident) {
      setTitle(incident.title);
      setDescription(incident.description);
      setValue(incident.value);
      setActive(Boolean(incident.active));
    }
  }, []);

  async function handleIncident() {
    try {
      const data = {
        title,
        description,
        value,
        active,
      };
      const config = {
        method: editing ? "patch" : "post",
        url: editing
          ? `/ongs/${ong.id}/incidents/${incident.id}`
          : `/ongs/${ong.id}/incidents`,
        data,
      };
      const response = await api(config);
      const newIncident = {
        ...incident,
        ...data,
      };
      handleNavigateBack(newIncident, editing);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      Alert.alert("Falha ao atualizar o caso", error.message);
      if (err?.response?.status === 401) unauthorized();
    }
  }

  return (
    <>
      <View>
        <Text style={styles.title}>
          {editing ? "Atualize o cadastro do caso" : "Cadastre o novo caso"}
        </Text>
      </View>
      <KeyboardAvoidingView
        style={styles.incident}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <TextInput
          style={styles.input}
          placeholder="Título do caso"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="sentences"
          autoCorrect={true}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição do caso"
          value={description}
          onChangeText={setDescription}
          autoCapitalize="sentences"
          autoCorrect={true}
          returnKeyType="next"
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
        />
        <TextInput
          style={styles.input}
          placeholder="Valor em reais (R$)"
          value={`${value}`}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
        <View style={styles.inputGroup}>
          <CheckBox value={active} onValueChange={() => setActive(!active)} />
          <Text>O caso está ativo</Text>
        </View>

        <TouchableOpacity style={styles.action} onPress={handleIncident}>
          <Text style={styles.actionText}>
            {editing ? "Atualizar" : "Cadastrar"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
};
