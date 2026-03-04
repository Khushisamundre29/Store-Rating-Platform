import React, { createContext, useState, useContext, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const isInitialized = useRef(false);

    // Configure axios instance ONCE - completely stable reference
    const api = useRef(null);
    
    if (!api.current) {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor
        instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Add response interceptor
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
                return Promise.reject(error);
            }
        );

        api.current = instance;
    }

    // Initialize auth state from localStorage ONCE
    useEffect(() => {
        if (!isInitialized.current) {
            isInitialized.current = true;
            
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Failed to parse stored user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const response = await api.current.post('/api/auth/login', { email, password });
            if (response.data) {
                const { token, user } = response.data;
                setToken(token);
                setUser(user);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        token,
        api: api.current,
        login,
        logout,
        loading,
    }), [user, token, login, logout, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};