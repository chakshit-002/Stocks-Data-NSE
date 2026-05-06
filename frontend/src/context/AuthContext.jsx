import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. App load hote hi session check karne ke liye
    const checkLogin = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

    // 2. Logout function ko bahar rakho taaki useAuth() se access ho sake
    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            // window.location.href use kar sakte ho ya fir react-router ka navigate
            window.location.href = '/login'; 
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        // 3. logout ko bhi value mein pass karo
        <AuthContext.Provider value={{ user, setUser, loading, logout, checkLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);