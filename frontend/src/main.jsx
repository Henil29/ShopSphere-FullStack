import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ProductContexProvider } from './context/product.contex.jsx'
import { UserContextProvider } from './context/user.contex.jsx'
import { CartContextProvider } from './context/cart.contex.jsx'
import { ReviewProvider } from './context/review.contex.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <ProductContexProvider>
        <CartContextProvider>
          <ReviewProvider>
            <App />
          </ReviewProvider>
        </CartContextProvider>
      </ProductContexProvider>
    </UserContextProvider>
  </StrictMode>,
)
