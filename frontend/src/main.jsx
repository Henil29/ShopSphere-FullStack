import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ProductContexProvider } from './context/product.contex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductContexProvider>
      <App />
    </ProductContexProvider>
  </StrictMode>,
)
