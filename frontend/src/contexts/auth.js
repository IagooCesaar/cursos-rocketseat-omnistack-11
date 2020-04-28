import React, { useState, useEffect, useContext, createContext } from "react";
import jwt from "jsonwebtoken";

import api from "../services/api";

const localStorageItem = "@BeTheHero:loginData";

const getLoginData = () => JSON.parse(localStorage.getItem(localStorageItem));

const removeLoginData = () => localStorage.removeItem(localStorageItem);

const setLoginData = (token, ong) => {
  return localStorage.setItem(
    localStorageItem,
    JSON.stringify({
      token,
      ong,
    })
  );
};

const AuthContextData = {
  authenticated: false,
  ong: null,
  updateOng: (newOng) => {
    console.log("Default update ong");
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
  const [loading, setLoading] = useState(true);
  const [ong, setOng] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  //Verificar no LocalStorage dados de Token armazenados
  useEffect(() => {
    async function isAuthenticated() {
      console.log("#Auth -> Verificando autenticação");
      const loginData = getLoginData();
      if (!loginData) {
        console.log("#Auth -> Não há dados de login");
        return false;
      }
      if (!loginData.token) {
        console.log("#Auth -> Não há um token");
        removeLoginData();
        return false;
      }

      const { payload: jwtPayload } = jwt.decode(loginData.token, {
        complete: true,
      });
      const today = Math.floor(Date.now() / 1000);
      if (jwtPayload.exp && today >= jwtPayload.exp) {
        console.log("#Auth -> O token expirou");
        removeLoginData();
        return false;
      }
      if (!jwtPayload.data.ongID) {
        console.log("#Auth -> Não foi possível identificar a ONG do token");
        removeLoginData();
        return false;
      }
      try {
        const response = await api.get(`/ongs/${jwtPayload.data.ongID}`, {
          headers: {
            authorization: loginData.token,
          },
        });
        setOng(loginData.ong);
        setLoading(false);
        setAuthenticated(true);
        api.defaults.headers.authorization = `Bearer ${loginData.token}`;
        console.log("#Auth -> O token é válido");
        return true;
      } catch (err) {
        console.log("#Auth -> Falha ao validar o Token na API");
        console.error(err);
        return false;
      }
    }
    isAuthenticated();
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
      console.error(err.message);
      if (err.response) {
        console.log("Error Status Code => " + err.response.status);
        switch (err.response.status) {
          case 400:
            return alert(err.response.data.message);
          case 422:
            return alert(err.response.data.message);
        }
      } else if (err.request) {
        console.log("Error Request =>", err.request);
      } else {
        alert(err.message);
      }
      return false;
    }
    try {
      const response = await api.get(`/ongs?email=${email}`);
      [ongData] = response.data;
      setOng(ongData);
    } catch (err) {
      console.log("Erro ao obter dados da ONG autenticada");
      console.error(err.message);
      return false;
    }
    setLoading(false);
    setAuthenticated(true);
    setLoginData(token, ongData);
    return true;
  }

  async function logout() {
    try {
      console.log("Tentativa de logout");
      const response = await api.post("/logout");
      removeLoginData();
      setAuthenticated(false);
      setOng(null);
      return true;
    } catch (err) {
      console.log("Falha ao realizar logout");
      console.error(err.message);
      return false;
    }
  }

  function updateOng(newOng) {
    setOng(newOng);
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        ong,
        updateOng,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
