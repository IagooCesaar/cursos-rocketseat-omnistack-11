import React, { createContext, useState } from "react";
import { AsyncStorage } from "react-native";

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

  async function login(email, password) {
    setLoading(false);
    setAuthenticated(true);
    setLogged(true);
  }

  async function anonimousAccess() {
    setLoading(false);
    setAuthenticated(false);
    setLogged(true);
  }

  async function logout() {
    setLoading(false);
    setAuthenticated(false);
    setLogged(false);
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
