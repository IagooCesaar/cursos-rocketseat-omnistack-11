import React, { useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg';
import './styles.css';

import api from '../../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsApp] = useState('')
  const [city, setCity] = useState('')
  const [uf, setUf] = useState('');

  const history = useHistory();

  async function handleRegister(e) {
    e.preventDefault();
    const data = {
      name, email, whatsapp, city, uf
    }
    try {
      const response = await api.post('/ongs', data);
      if (!response) return alert('Não foi possível concluir o seu cadastro')
      alert(`Seu ID de acesso: ${response.data.ong_id}`)
      history.push('/');

    } catch(err) {
      alert('Falha ao tentar realizar o cadastro')
    }
  }

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
        <form onSubmit={handleRegister}>
          <input 
            placeholder="Nome da ONG" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            placeholder="WhatsApp" 
            value={whatsapp} 
            onChange={e => setWhatsApp(e.target.value)} 
            required
          />
          <div className="input-group">
            <input 
              placeholder="Cidade" 
              value={city} 
              onChange={e => setCity(e.target.value)} 
              required
            />
            <input 
              placeholder="UF" 
              style={{ width: 80 }} 
              value={uf} 
              onChange={e => setUf(e.target.value)}
              required 
            />
          </div>
          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
    )
  }