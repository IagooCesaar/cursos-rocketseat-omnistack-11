import React from 'react';

const authorizationData = (history) => {

    const loggedOng = JSON.parse(localStorage.getItem('loggedOng'))
    if (!loggedOng) {
      alert('Você precisa se autenticar para acessar esta página')
      return history.push('/')
    }
    return loggedOng;
}

export default authorizationData;