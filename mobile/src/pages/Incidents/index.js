import React, { useState, useEffect} from 'react'
import { 
  View, 
  FlatList,
  Text, 
  Image ,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

import api from '../../services/api'

import logoImg from '../../assets/logo.png'
import styles from './styles';

export default function Incidents() {
  const [incidents, setIncidents ] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)


  const navigation = useNavigation();
  
  async function loadIncidents() {  
    if (loading) {
      console.log('Carregamento pendente em execução')
      return
    }
    if (total > 0 && incidents.length === total) {
      console.log('Não será necessário buscar novos itens')
      return
    }
        
    setLoading(true)  
    try {     
      console.log('Buscando casos, página '+page)   
      const response = await api.get('/incidents',{
        params: {
          page    
        }
      })
      if (response.data)
      setIncidents([...incidents, ...response.data])

      if ((response.headers['x-total-count'] || 0 ) !== total) {
        setTotal(response.headers['x-total-count'])
      }
      
    } catch(err) {
      console.log('erro ao buscar incidentes',err)
    }   

    setLoading(false)
    setPage(page+1)
  }

  useEffect(() => {    
    loadIncidents();    
  },[])

  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident });
  }
  return (
    <View style={styles.container}>      
      <View style={styles.header}>
        <Image source={logoImg}  />
         <Text style={styles.headerText}>
           Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
         </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>
      { incidents && (
        <FlatList 
          style={styles.incidentList}
          showsVerticalScrollIndicator={false}
          onEndReached={loadIncidents}
          onEndReachedThreshold={0.2}
          data={incidents}
          keyExtractor={incident => String(incident.id)}
          renderItem={({item: incident})  => (
            <View style={styles.incident} >
              <Text style={styles.incidentProperty}>ONG:</Text>  
              <Text style={styles.incidentValue}>{incident.name}</Text>  

              <Text style={styles.incidentProperty}>Caso:</Text>  
              <Text style={styles.incidentValue}>{incident.title}</Text>  

              <Text style={styles.incidentProperty}>VALOR:</Text>  
              <Text style={styles.incidentValue}>
                { Intl
                  .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                  .format(incident.value) 
                }
              </Text>  

              <TouchableOpacity 
                style={styles.detailsButton} 
                onPress={() => navigateToDetail(incident)} 
              >
                <Text style={styles.detailsButtonText} >Ver mais detalhes</Text>
                <Feather name="arrow-right" size={16} color="#e02041" />
              </TouchableOpacity>
            </View>
          )}
        /> 
      )}

    </View>
  )
}