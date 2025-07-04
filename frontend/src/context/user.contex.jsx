import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false)


    async function fetchUser() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/user/me");
            setUser(data.user);
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
            throw (error.response?.data?.message || "Login failed");
        }
    }
    async function signUp(name, email, password, isSeller, navigate, fetchProduct) {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/auth/register", { name, email, password, isSeller });
            setUser(data.user);
            setIsAuth(true);
            navigate("/");
            fetchProduct();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw (error.response?.data?.message || "Registration failed");
        }
    }
    async function logoutUser() {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/auth/logout");
            setUser(null);
            setIsAuth(false);
            setLoading(false);
        }
        catch (error) {
            console.error("Failed to logout:", error);
            setLoading(false);
        }
    }
    async function updateUserInfo(formData) {
        setLoading(true);
        try {
            const { data } = await axios.put("/api/user/update", formData);
            await fetchUser();
            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setLoading(false);
            return {
                success: false,
                message: error.response?.data?.message || "Update failed"
            };
        }
    }

    async function deleteUserAccount() {
        setLoading(true);
        try {
            const { data } = await axios.delete("/api/user/delete");
            setUser(null);
            setIsAuth(false);
            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setLoading(false);
            return {
                success: false,
                message: error.response?.data?.message || "Delete failed"
            };
        }
    }


    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, isAuth, fetchUser, loginUser, logoutUser, signUp, updateUserInfo, deleteUserAccount }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);