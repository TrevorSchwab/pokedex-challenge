import React from 'react'
import { Router } from '@reach/router'
import Home from './Home'
import Pokemon from './pokemon'

const Screens: React.FC<{ clickLink: Function }> = ({ clickLink }) => (
  <Router style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Home path="/" />
    <Pokemon clickLink={clickLink} path="/pokemon/*" />
  </Router>
)

export default Screens
