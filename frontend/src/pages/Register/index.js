import React from 'react';
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg';
import './styles.css';

export default function Register() {
  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          <h1>Cadastre sua ONG</h1>
          <p>Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem ajuda para os casos de suas ONGs.</p>

          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#e02041" />
            Voltar
          </Link>
        </section>
        <form>
          <input placeholder="Nome da ONG" />
          <input type="email" placeholder="E-mail" />
          <input placeholder="WhatsApp" />
          <div className="input-group">
            <input placeholder="Cidade" />
            <input placeholder="UF" style={{ width: 80 }} />
          </div>
          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
    )
  }