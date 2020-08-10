import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import 'minireset.css'
import './App.css'
import Screens from '../screens'
import Pokedex from './Pokedex'
import 'semantic-ui-css/semantic.min.css'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Pokedex>{clickLink => <Screens clickLink={clickLink} />}</Pokedex>
    </ApolloProvider>
  )
}

export default App
