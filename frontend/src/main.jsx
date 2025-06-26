import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ProductContexProvider } from './context/product.contex.jsx'
import { UserContextProvider } from './context/user.contex.jsx'
import { CartContextProvider } from './context/cart.contex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <ProductContexProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </ProductContexProvider>
    </UserContextProvider>
  </StrictMode>,
)
