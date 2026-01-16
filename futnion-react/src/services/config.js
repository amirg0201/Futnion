// src/services/config.js

// URL de tu Backend en Render
export const API_BASE_URL = 'https://futnion.onrender.com/api';

// Helper para obtener headers (igual que antes, pero listo para React)
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};