import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import '@/shared/styles/reset.css'

const isDev = import.meta.env.DEV

const renderApp = (levaComponent: React.ReactNode) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {levaComponent}
      <App />
    </StrictMode>
  )
}

if (isDev) {
  import('leva').then(({ Leva }) => {
    renderApp(
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
    )
  })
} else {
  renderApp(null)
}
