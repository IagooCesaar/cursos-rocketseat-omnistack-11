import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";
import "./styles.css";

import api from "../../services/api";
import useAuth from "../../contexts/auth";

export default function Register({ action = "insert" }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  const history = useHistory();
  const { ong, updateOng } = useAuth();

  useEffect(() => {
    if (action === "edit") {
      setEditing(true);
      setName(ong.name);
      setEmail(ong.email);
      setWhatsApp(ong.whatsapp);
      setCity(ong.city);
      setUf(ong.uf);
    }
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
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
        method: editing ? "patch" : "post",
        url: editing ? `/ongs/${ong.id}` : "/ongs",
        data,
      };
      // const response = await api.post("/ongs", data);
      const response = await api(options);
      if (!response) return alert("Não foi possível concluir o seu cadastro");
      newOng = response.data[0];
      console.table(newOng);
      history.push("/");
    } catch (err) {
      alert("Falha ao tentar realizar o cadastro");
      console.error(err);
    }
    if (editing) updateOng(newOng);
  }

  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          {!editing ? (
            <>
              <h1>Cadastre sua ONG</h1>
              <p>
                Faça seu cadastro, entre na plataforma e ajude pessoas a
                encontrarem ajuda para os casos de suas ONGs.
              </p>
            </>
          ) : (
            <>
              <h1>Edite o cadastro de sua ONG</h1>
              <p>
                Altere os dados desejados para atualizar o cadastro de sua ONG
              </p>
            </>
          )}

          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#e02041" />
            Voltar
          </Link>
        </section>
        <form onSubmit={handleRegister}>
          <input
            placeholder="Nome da ONG"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsApp(e.target.value)}
            required
          />
          <div className="input-group">
            <input
              placeholder="Cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              placeholder="UF"
              style={{ width: 80 }}
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              required
            />
          </div>
          <button className="button" type="submit">
            {editing ? "Atualizar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
