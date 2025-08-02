import axios from '../config/axios';
import { createContext, useContext, useEffect, useState } from 'react';

const ProductContex = createContext();

export const ProductContexProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [singleProduct, setSingleProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    async function fetchProduct() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/product/all");
            setProducts(data.products);
            setFilteredProducts(data.products); // keep filtered in sync
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

    

    async function addProduct(productData) {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('oldprice', productData.oldprice);
            formData.append('newprice', productData.newprice);
            formData.append('details', productData.details);
            // Fix: append each category separately if array
            if (Array.isArray(productData.category)) {
                productData.category.forEach(cat => formData.append('category', cat));
            } else if (productData.category) {
                formData.append('category', productData.category);
            }
            formData.append('quantity', productData.quantity);
            formData.append('timeToDeliver', productData.timeToDeliver || '1 week');
            formData.append('image', productData.image); // image should be a File object

            const { data } = await axios.post('/api/product/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Optionally, refetch products or add the new product to state
            await fetchProduct();
            setLoading(false);
            return { success: true, product: data.product, message: data.message };
        } catch (error) {
            setLoading(false);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add product',
            };
        }
    }

    async function deleteProduct(productId) {
        setLoading(true);
        try {
            const { data } = await axios.delete(`/api/product/${productId}`);
            await fetchProduct();
            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setLoading(false);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete product',
            };
        }
    }

    async function updateProduct(productId, productData) {
        setLoading(true);
        try {
            const formData = new FormData();
            if (productData.name) formData.append('name', productData.name);
            if (productData.oldprice) formData.append('oldprice', productData.oldprice);
            if (productData.newprice) formData.append('newprice', productData.newprice);
            if (productData.details) formData.append('details', productData.details);
            if (Array.isArray(productData.category)) {
                productData.category.forEach(cat => formData.append('category', cat));
            } else if (productData.category) {
                formData.append('category', productData.category);
            }
            if (productData.quantity) formData.append('quantity', productData.quantity);
            if (productData.timeToDeliver) formData.append('timeToDeliver', productData.timeToDeliver);
            if (productData.image) formData.append('image', productData.image);

            const { data } = await axios.put(`/api/product/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchProduct();
            setLoading(false);
            return { success: true, product: data.product, message: data.message };
        } catch (error) {
            setLoading(false);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update product',
            };
        }
    }

    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <ProductContex.Provider value={{ 
            products, 
            filteredProducts,
            setFilteredProducts,
            singleProduct, 
            loading, 
            fetchProduct, 
            fetchOneProduct, 
            addProduct, // Expose addProduct
            deleteProduct, // Expose deleteProduct
            updateProduct // Expose updateProduct
        }}>
            {children}
        </ProductContex.Provider>
    );
};

export const ProductData = () => useContext(ProductContex);
