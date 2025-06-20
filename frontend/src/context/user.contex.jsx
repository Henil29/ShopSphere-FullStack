import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false)


    async function fetchUser() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/user/me");
            setUser(data);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setLoading(false);
        }
    }

    async function loginUser(email, password, navigate, fetchProduct) {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/auth/login", { email, password });
            setUser(data.user);
            setIsAuth(true);
            navigate("/");
            fetchProduct();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            // Throw the error message up to the page
            throw (error.response?.data?.message || "Login failed");
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, isAuth, fetchUser, loginUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);