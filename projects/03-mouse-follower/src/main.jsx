import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode ayuda a asegurarte que los efectos estan haciendo la limpieza
  // No funciona en produccion sino que en desarrollo
  <StrictMode>
    <App />
  </StrictMode>,
)
