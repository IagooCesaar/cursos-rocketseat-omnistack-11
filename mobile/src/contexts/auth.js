import React, { createContext, useState, useEffect } from "react";
import { AsyncStorage, Alert } from "react-native";
import { SplashScreen } from "expo";

import api from "../services/api";

const localStorageItem = "@BeTheHero:loginData";

const getLoginData = async () => {
  const data = await AsyncStorage.getItem(localStorageItem);
  return JSON.parse(data);
};

const setLoginData = async (anonimous, token, ong) => {
  return await AsyncStorage.setItem(
    localStorageItem,
    JSON.stringify({
      anonimous,
      token,
      ong,
    })
  );
};

const removeLoginData = async () =>
  await AsyncStorage.removeItem(localStorageItem);

const AuthContextData = {
  logged: false,
  authenticated: false,
  unauthorized: () => {
    console.log("Default unauthorized");
    return false;
  },
  ong: null,
  updateOng: (newOng) => {
    console.log("Default update ong");
    return false;
  },
  anonimousAccess: () => {
    console.log("Default anonimousAccess");
    return false;
  },
  login: (email, password) => {
    console.log("Default login");
    return false;
  },
  logout: () => {
    console.log("Default logout");
    return false;
  },
  loading: true,
};

const AuthContext = createContext(AuthContextData);

export const AuthProvider = ({ children }) => {
  const [ong, setOng] = useState();
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!loading) SplashScreen.hide();
  }, [loading]);

  useEffect(() => {
    async function isAuthenticated() {
      console.log("#Auth -> Verificando autenticação");
      const loginData = await getLoginData();
      if (!loginData) {
        console.log("#Auth -> Não há dados de login");
        setLoading(false);
        return false;
      }
      console.log("#Auth -> Login data", loginData);
      if (loginData.anonimous) {
        console.log("#Auth -> Acesso anônimo");
        anonimousAccess();
        return true;
      }
      if (!loginData.token) {
        console.log("#Auth -> Não há um token");
        removeLoginData();
        return false;
      }
      try {
        const response = await api.get(`/ongs/${loginData.ong.id}`, {
          headers: {
            authorization: loginData.token,
          },
        });

        setOng(loginData.ong);
        setAuthenticated(true);
        setLogged(true);
        setLoading(false);
        api.defaults.headers.authorization = `Bearer ${loginData.token}`;
        console.log("#Auth -> O token é válido");
        return true;
      } catch (err) {
        console.log("#Auth -> Falha ao validar o Token na API");
        console.error(err);
        setLoading(false);
        return false;
      }
    }
    isAuthenticated();
    setLoading(false);
  }, []);

  async function login(email, password) {
    console.log("Tentativa de login");
    let token = "";
    let ongData = {};
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      token = response.data.token;
      api.defaults.headers.authorization = `Bearer ${token}`;
    } catch (err) {
      console.log("Erro ao autenticar-se");
      if (err.response) {
        console.log("Error Status Code => " + err.response.status);
        switch (err.response.status) {
          case 400:
            return Alert.alert("Bad Request", err.response.data.message);
          case 422:
            return Alert.alert("422", err.response.data.message);
        }
      } else if (err.request) {
        console.log("Error Request =>", err.request);
      } else {
        Alert.alert("Erro", err.message);
      }
      return false;
    }
    try {
      const response = await api.get(`/ongs?email=${email}`);
      [ongData] = response.data;
      setOng(ongData);
      setAuthenticated(true);
      setLogged(true);
      setLoginData(false, token, ongData);
    } catch (err) {
      console.log("Erro ao obter dados da ONG autenticada");
      console.error(err.message);
      return false;
    }
    setLoading(false);
  }

  async function anonimousAccess() {
    setLoading(false);
    setAuthenticated(false);
    setLogged(true);
    setLoginData(true, "", {});
  }

  async function logout() {
    setLoading(false);
    setAuthenticated(false);
    setLogged(false);
    removeLoginData();
  }

  return (
    <AuthContext.Provider
      value={{
        logged,
        authenticated,
        anonimousAccess,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = React.useContext(AuthContext);
  return context;
}
