import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home.jsx';
import Product from '../src/pages/Product.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
function App() {

  return (
    <>
      <BrowserRouter>
      <NavigationBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
