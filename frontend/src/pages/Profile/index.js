import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg';
import './styles.css';

import api from '../../services/api';
import authorizationData from '../../utils/authorizationData'

export default function Profile () {
  const [ong, setOng] = useState({});
  const [incidents, setIncidents ] = useState([]);
  const history = useHistory();
  //Dados da ONG logada
  useEffect(() => {
    const loggedOng = authorizationData(history);
    setOng(loggedOng)
  }, [])
  //Buscando casos da ONG após identicada como logada
  useEffect(() => {
    async function loadIncidents(){
      try {
        console.log('obtendo lista de incidentes da ong '+ong.id)
        const response = await api.get('/profile',{
          headers: {
            Authorization: ong.id
          }
        })
        console.log('incidentes obtidos')
        console.table(response.data)
        if (response.data)
          setIncidents(response.data)
      } catch(err) {
        alert('Falha ao obter a lista de casos. Tente atualizar a página')
      }
    }
    loadIncidents();
  }, [ong])
  //Deletar determinado caso
  async function handleDeleteIncident(id) {
    try {
      const response = await api.delete(`/incidents/${id}`,{
        headers:{
          Authorization: ong.id
        }
      })
      const filterIncidentes = incidents.filter(incident => incident.id !== id )
      setIncidents(filterIncidentes)
    } catch(err) {
      alert('Falha ao deletar o caso selecionado')
    }
  }
  //Logout da ONG 
  async function handleLogout() {
    localStorage.removeItem('loggedOng');
    history.push('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem vinda, {ong.name || 'Nome da ONG'} </span>
        <Link to="/incidents/new" className="button">Cadastrar novo caso</Link>
        <button type="button" onClick={() => handleLogout()}>
          <FiPower size={18} color="#e02041" />
        </button>
      </header>
      <h1>Casos cadastrados</h1>
      <ul>
        {incidents && (incidents.map(incident => (
          <li key={incident.id} >
            <strong>CASO:</strong>
            <p>{incident.title}</p>

            <strong>DESCRIÇÃO</strong>
            <p>{incident.description}</p>

            <strong>VALOR:</strong>
            <p>{Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(incident.value)}
            </p>

            <button type="button" onClick={() => handleDeleteIncident(incident.id)} >
              <FiTrash2 size={20} color="#a8a8b3"/>            
            </button>
          </li>
        )))}
        
        
      </ul>
    </div>
  )
}