import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedToken);
        }

        setLoading(false);
    }, [])

    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);

            const userData = {
                email: response.email,
                username: response.username,
                roles: response.roles || []
            };

            setUser(userData);
            setAccessToken(response.accessToken);

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', response.accessToken);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    const register = async (username, email, password) => {
        try {
            const response = await authApi.register(username, email, password);

            const userData = {
                email: response.email,
                username: response.username,
                roles: response.roles || []
            };

            setUser(userData);
            setAccessToken(response.accessToken);

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', response.accessToken);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        }
    };

    const isAdmin = () => {
        return user?.roles?.includes('ROLE_ADMIN') || false;
    };

    const value = {
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}