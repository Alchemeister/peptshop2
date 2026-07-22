import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './frontend.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Preview root was not found')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
