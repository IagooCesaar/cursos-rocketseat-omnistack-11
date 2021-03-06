import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import useAuth from "../../contexts/auth";
import api from "../../services/api";

import logoImg from "../../assets/logo.png";
import styles from "./styles";

export default function Incidents() {
  const { logout, authenticated, ong, unauthorized } = useAuth();
  const route = useRoute();

  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    if (route.params?.newIncident) {
      editIncidentList(route.params.newIncident, route.params.editing);
    }
  }, [route.params?.newIncident]);

  function editIncidentList(newIncident, editing) {
    if (newIncident) {
      if (incidents) {
        if (editing) {
          const alteredIncident = incidents.map((incident) => {
            if (incident.id === newIncident.id) {
              incident = newIncident;
            }
            return incident;
          });
          setIncidents(alteredIncident);
        } else {
          setIncidents([...incidents, newIncident]);
        }
      } else setIncidents(newIncident);
    }
  }

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
      if (err?.response?.status === 401) unauthorized();
    }

    setLoading(false);
    setPage(page + 1);
  }

  async function handleLogout() {
    logout();
  }

  async function handleDelete(id) {
    try {
      console.log("Tentativa de deletar caso");
      const response = await api.delete(`/ongs/${ong.id}/incidents/${id}`);

      const filterIncidentes = incidents.filter(
        (incident) => incident.id !== id
      );
      setIncidents(filterIncidentes);
    } catch (err) {
      console.log("erro ao buscar incidentes", err);
      console.log("erro ao buscar incidentes", err.response.data.message);
      Alert.alert("Falha ao buscar casos", err.message);
      if (err?.response?.status === 401) unauthorized();
    }
  }

  function navigateToDetail(incident, editing = false) {
    navigation.navigate("Detail", { incident, editing });
    // navigation.navigate("Detail", {
    //   incident,
    //   editing,
    //   onGoBack: (newIncident) => {
    //     editIncidentList(newIncident, editing);
    //   },
    // });
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
              {!authenticated ? (
                <>
                  <Text style={styles.incidentProperty}>ONG:</Text>
                  <Text style={styles.incidentValue}>{incident.name}</Text>
                </>
              ) : (
                <></>
              )}

              <Text style={styles.incidentProperty}>Caso:</Text>
              <Text style={styles.incidentValue}>{incident.title}</Text>

              <Text style={styles.incidentProperty}>Valor:</Text>
              <Text style={styles.incidentValue}>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(incident.value)}
              </Text>
              {authenticated ? (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => navigateToDetail(incident, true)}
                  >
                    <Feather name="edit-2" size={16} color="#e02041" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => handleDelete(incident.id)}
                  >
                    <Feather name="trash-2" size={16} color="#e02041" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigateToDetail(incident)}
                >
                  <Text style={styles.detailsButtonText}>
                    Ver mais detalhes
                  </Text>
                  <Feather name="arrow-right" size={16} color="#e02041" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
      {authenticated ? (
        <FloatingButton onPress={() => navigateToDetail(null, false)} />
      ) : (
        <></>
      )}
    </View>
  );
}

const FloatingButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.floatingButton}>
      <Feather name="plus-circle" size={50} color="#e02041" />
    </TouchableOpacity>
  );
};
