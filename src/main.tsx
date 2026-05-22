import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Ensure DI registrations run before the app mounts
import '@/core/di/register'
import App from './App.tsx'
import './reset.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
