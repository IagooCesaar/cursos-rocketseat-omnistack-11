import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'

import './styles.css';
import heroesImg from '../../assets/heroes.png';
import logoImg from '../../assets/logo.svg';

import api from '../../services/api'

export default function Logon() {
  const [id, setId] = useState('');
  const history = useHistory();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await api.post('/sessions', {
        id
      })
      localStorage.setItem('loggedOng',JSON.stringify({
        id, 
        name: response.data.name 
      }))
      history.push('/profile')
    } catch(err) {
      alert('ONG não contrada. Tente realizar seu cadastro')
      history.push('/register')
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <img src={logoImg} alt="Be The Hero" />
        <form onSubmit={handleLogin} >
          <h1>Faça seu logon</h1>

          <input 
            type="text" 
            placeholder="Sua ID"
            required
            value={id}
            onChange={e => setId(e.target.value)}
          />
          <button className="button">Entrar</button>

          <Link className="back-link" to="/register">
            <FiLogIn size={16} color="#e02041" />
            Não tenho cadastro
          </Link>
        </form>
      </section>
      <img src={heroesImg} alt="Heroes" />
    </div>    
  )
}