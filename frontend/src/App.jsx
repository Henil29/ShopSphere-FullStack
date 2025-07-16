import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home.jsx';
import Product from '../src/pages/Product.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';
import UpdateProfile from './pages/UpdateProfile.jsx';
import Order from './pages/Order.jsx';
import IsSeller from './pages/IsSeller.jsx';
import SellerProducts from './pages/SellerProducts.jsx';
import UpdateProduct from './pages/UpdateProduct.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/order" element={<Order />} />
          <Route path="/seller" element={<IsSeller />} />
          <Route path="/my-products" element={<SellerProducts />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
      </BrowserRouter>
    </>
  )
}

export default App
