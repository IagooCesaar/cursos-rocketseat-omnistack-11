import React from 'react';

import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg';
import './styles.css';


export default function NewIncident() {
    return (
        <div className="new-incident-container">
          <div className="content">
            <section>
              <img src={logoImg} alt="Be The Hero" />
              <h1>Cadastre o novo caso</h1>
              <p>Descreva o caso detalhadamente para encontrar um herói para resolvê-lo</p>
    
              <Link className="back-link" to="/profile">
                <FiArrowLeft size={16} color="#e02041" />
                Voltar para o perfil
              </Link>
            </section>
            <form>
              <input placeholder="Título do caso" />
              <textarea placeholder="Descrição" />
              <input placeholder="Valor em reais (R$)" />
              
              <button className="button" type="submit">Cadastrar</button>
            </form>
          </div>
        </div>
        )
}