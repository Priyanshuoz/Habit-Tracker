import React, { createContext, useContext, useState, useEffect, Children } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children} ) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    })

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    })

    //Login Function
    const login = (newToken , userData) => {
        setToken(newToken);
        setUser(userData)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    //Logout Function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}