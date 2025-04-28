/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

/*
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/

const root = ReactDOM.createRoot(document.getElementById('root'))

//Usamos PascalCase
//Creamos el componente 


root.render(
  <App />
)
