import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ProductContexProvider } from './context/product.contex.jsx'
import { UserContextProvider } from './context/user.contex.jsx'
import { CartContextProvider } from './context/cart.contex.jsx'
import { ReviewProvider } from './context/review.contex.jsx';
import { OrderContextProvider } from './context/order.contex.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <ProductContexProvider>
        <CartContextProvider>
          <OrderContextProvider>
            <ReviewProvider>
              <App />
            </ReviewProvider>
          </OrderContextProvider>
        </CartContextProvider>
      </ProductContexProvider>
    </UserContextProvider>
  </StrictMode>,
)
