import React, { useState, useEffect } from "react";

import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";
import "./styles.css";

import useAuth from "../../contexts/auth";
import api from "../../services/api";

export default function NewIncident({ action = "insert", match }) {
  const { ong, unauthorized } = useAuth();
  const [incidentId, setIncidentId] = useState(0);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [active, setActive] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const id = match.params.incident_id || 0;
    if (action === "edit") {
      setEditing(true);
      setIncidentId(match.params.incident_id);
    }
    async function getIncidentData() {
      try {
        const response = await api.get(`/ongs/${ong.id}/incidents/${id}`);
        const incident = response.data;
        console.log("Incident", incident);
        setTitle(incident.title);
        setDescription(incident.description);
        setValue(incident.value);
        setActive(Boolean(incident.active));
      } catch (error) {
        console.log("Erro:: " + error);
        if (error.response) {
          switch (error.response.status) {
            case 400:
              return alert(
                error.response.data.error + ": " + error.response.data.message
              );
            case 422:
              return alert(
                error.response.data.error + ": " + error.response.data.message
              );
            case 401:
              alert(
                error.response.data.error + ": " + error.response.data.message
              );
              unauthorized();
              return;
          }
        }
      }
    }
    if (id > 0) getIncidentData();
  }, []);

  async function handleNewIncident(e) {
    e.preventDefault();
    try {
      const config = {
        method: editing ? "patch" : "post",
        url: editing
          ? `/ongs/${ong.id}/incidents/${incidentId}`
          : `/ongs/${ong.id}/incidents`,
        data: {
          title,
          description,
          value,
          active,
        },
      };
      const response = await api(config);
      if (response.data) {
        history.push("/profile");
      }
    } catch (error) {
      if (error.response) {
        console.log("Error response :: ", error.response.data);
        switch (error.response.status) {
          case 400:
            return alert(
              error.response.data.error + ": " + error.response.data.message
            );
          case 422:
            return alert(
              error.response.data.error + ": " + error.response.data.message
            );
          case 401:
            alert(
              error.response.data.error + ": " + error.response.data.message
            );
            unauthorized();
            return;
        }
      }
    }
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          {editing ? (
            <>
              <h1>Atualize o cadastro do caso</h1>
              <p>
                Descreva o caso detalhadamente para encontrar um herói para
                resolvê-lo
              </p>
            </>
          ) : (
            <>
              <h1>Cadastre o novo caso</h1>
              <p>
                Descreva o caso detalhadamente para encontrar um herói para
                resolvê-lo
              </p>
            </>
          )}

          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#e02041" />
            Voltar para o perfil
          </Link>
        </section>
        <form onSubmit={handleNewIncident}>
          <input
            placeholder="Título do caso"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            placeholder="Valor em reais (R$)"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div>
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={() => setActive(!active)}
            />
            <label htmlFor="active">O caso está ativo</label>
          </div>

          <button className="button" type="submit">
            {editing ? "Atualizar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
