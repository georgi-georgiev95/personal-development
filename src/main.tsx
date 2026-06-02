import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import '@/shared/styles/reset.css'
import { Leva } from 'leva'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Leva
      titleBar={{
        title: 'Controls',
        position: { x: 8, y: 72 },
      }}
      theme={{
        sizes: { rootWidth: '300px' },
        space: { sm: '6px', md: '10px', rowGap: '4px', colGap: '4px' },
      }}
    />
    <App />
  </StrictMode>
)
