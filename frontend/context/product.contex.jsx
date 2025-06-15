import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const ProductContex = createContext();

export const ProductContexProvider = ({ children }) => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchProduct() {
        setLoading(true)
        try {
            const { data } = await axios.get("/api/product/all")
            console.log(data)
            setProduct(data.products)
            setLoading(false)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching products")
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [])
    return <ProductContex.Provider value={{ product, loading }}>{children}</ProductContex.Provider>

}

export const ProductData = () => useContext(ProductContex)