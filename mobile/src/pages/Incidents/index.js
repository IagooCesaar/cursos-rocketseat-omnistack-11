import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import useAuth from "../../contexts/auth";
import api from "../../services/api";

import logoImg from "../../assets/logo.png";
import styles from "./styles";

export default function Incidents() {
  const { logout, authenticated, ong } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  async function loadIncidents() {
    if (loading) {
      console.log("Carregamento pendente em execução");
      return;
    }
    if (total > 0 && incidents.length === total) {
      console.log("Não será necessário buscar novos itens");
      return;
    }

    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: authenticated ? `ongs/${ong.id}/incidents` : "/incidents",
        params: {
          page,
        },
      };
      const response = await api(options);
      if (response.data) setIncidents([...incidents, ...response.data]);

      if ((response.headers["x-total-count"] || 0) !== total) {
        setTotal(response.headers["x-total-count"]);
      }
    } catch (err) {
      console.log("erro ao buscar incidentes", err);
      console.log("erro ao buscar incidentes", err.response.data.message);
      Alert.alert("Falha ao buscar casos", err.message);
    }

    setLoading(false);
    setPage(page + 1);
  }

  async function handleLogout() {
    logout();
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  function navigateToDetail(incident) {
    navigation.navigate("Detail", { incident });
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="power" size={16} color="#e02041" />
        </TouchableOpacity>
      </View>
      {authenticated ? (
        <>
          <Text style={styles.title}>Bem vinda, {ong.name}</Text>
          <Text style={styles.description}>Casos cadastrados e ativos</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.description}>
            Escolha um dos casos abaixo e salve o dia.
          </Text>
        </>
      )}
      {incidents && (
        <FlatList
          style={styles.incidentList}
          showsVerticalScrollIndicator={false}
          onEndReached={loadIncidents}
          onEndReachedThreshold={0.2}
          data={incidents}
          keyExtractor={(incident) => String(incident.id)}
          renderItem={({ item: incident }) => (
            <View style={styles.incident}>
              <Text style={styles.incidentProperty}>ONG:</Text>
              <Text style={styles.incidentValue}>{incident.name}</Text>

              <Text style={styles.incidentProperty}>Caso:</Text>
              <Text style={styles.incidentValue}>{incident.title}</Text>

              <Text style={styles.incidentProperty}>VALOR:</Text>
              <Text style={styles.incidentValue}>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(incident.value)}
              </Text>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigateToDetail(incident)}
              >
                <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                <Feather name="arrow-right" size={16} color="#e02041" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
