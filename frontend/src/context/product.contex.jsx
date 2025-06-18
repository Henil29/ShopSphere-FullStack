import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const ProductContex = createContext();

export const ProductContexProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [singleProduct, setSingleProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    async function fetchProduct() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/product/all");
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch all products:", error);
            setLoading(false);
        }
    }

    async function fetchOneProduct(id) {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/product/${id}`);
            setSingleProduct(data.product);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch product:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <ProductContex.Provider value={{ 
            products, 
            singleProduct, 
            loading, 
            fetchProduct, 
            fetchOneProduct 
        }}>
            {children}
        </ProductContex.Provider>
    );
};

export const ProductData = () => useContext(ProductContex);
