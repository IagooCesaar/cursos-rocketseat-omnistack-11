import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2, FiEdit2 } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";
import "./styles.css";

import api from "../../services/api";
import useAuth from "../../contexts/auth";

export default function Profile() {
  const { ong, logout, authenticated } = useAuth();

  const [incidents, setIncidents] = useState([]);
  const history = useHistory();

  //Buscando casos da ONG após identicada como logada
  useEffect(() => {
    async function loadIncidents() {
      try {
        console.log("obtendo lista de incidentes da ong " + ong.id);
        const response = await api.get(`/ongs/${ong.id}/incidents`);
        console.log(
          "Quantidade de incidentes obtidos: " + response.data.length
        );
        if (response.data) setIncidents(response.data);
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              return (authenticated = false);
          }
        }
        alert("Falha ao obter a lista de casos. Tente atualizar a página");
        console.error(err);
      }
    }
    if (ong.id) loadIncidents();
  }, [ong]);

  //Deletar determinado caso
  async function handleDeleteIncident(id) {
    try {
      console.log("URL => ", `/ongs/${ong.id}/incidents/${id}`);
      const response = await api.delete(`/ongs/${ong.id}/incidents/${id}`);

      const filterIncidentes = incidents.filter(
        (incident) => incident.id !== id
      );
      setIncidents(filterIncidentes);
    } catch (err) {
      console.log("Erro ao inativar caso");
      console.error(err);
      alert("Falha ao deletar o caso selecionado");
    }
  }
  //Logout da ONG
  async function handleLogout() {
    await logout();
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem vinda, {ong.name || "Nome da ONG"} </span>
        <Link to="/register/edit" className="button button-secundary">
          Editar o cadastro
        </Link>
        <Link to="/incidents/new" className="button">
          Cadastrar novo caso
        </Link>
        <button type="button" onClick={() => handleLogout()}>
          <FiPower size={18} color="#e02041" />
        </button>
      </header>
      <h1>Casos cadastrados e ativos</h1>
      <ul>
        {incidents &&
          incidents.map((incident) => (
            <li key={incident.id}>
              <strong>CASO:</strong>
              <p>{incident.title}</p>

              <strong>DESCRIÇÃO</strong>
              <p>{incident.description}</p>

              <strong>VALOR:</strong>
              <p>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(incident.value)}
              </p>

              <Link to={`/incidents/edit/${incident.id}`} className="edit">
                <FiEdit2 size={20} color="#a8a8b3" />
              </Link>
              <button
                type="button"
                className="delete"
                onClick={() => handleDeleteIncident(incident.id)}
              >
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
