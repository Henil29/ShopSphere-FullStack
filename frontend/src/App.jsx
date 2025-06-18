import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/pages/Home.jsx';
import Product from '../src/pages/Product.jsx';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
