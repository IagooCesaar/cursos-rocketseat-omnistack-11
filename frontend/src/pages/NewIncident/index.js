import React, {useState, useEffect } from 'react';

import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg';
import './styles.css';

import api from '../../services/api'
import authorizationData from '../../utils/authorizationData'

export default function NewIncident() {
  const [ong, setOng] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription ] = useState('');
  const [value, setValue ] = useState('');
  const history = useHistory();
  
  //Dados da ONG logada
  useEffect(() => {
    const loggedOng = authorizationData(history);
    setOng(loggedOng)
  }, [])

  async function handleNewIncident(e) {
    e.preventDefault();
    try {
      const response = await api.post('/incidents',{
        title,
        description,
        value
      }, {
        headers: {
          Authorization: ong.id
        }
      })
      if (response.data) {
        alert(`Novo caso cadastrado com sucesso (ID: ${response.data.id} )`)
        history.push('/profile');
      }
    } catch(err) {
      alert('Erro ao cadastrar novo caso')
    }
  }
  
  
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
        <form onSubmit={handleNewIncident}>
          <input 
            placeholder="Título do caso" 
            required
            value={title}  
            onChange={e => setTitle(e.target.value)}
          />
          <textarea 
            placeholder="Descrição" 
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input 
            placeholder="Valor em reais (R$)" 
            required
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          
          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
    )
  }