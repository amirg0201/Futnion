// src/services/matchService.js
import { API_BASE_URL, getAuthHeaders } from './config';

// DIP: La app depende de estas funciones, no de 'fetch' directamente.

export const createMatchAPI = async (matchData) => {
    const response = await fetch(`${API_BASE_URL}/partidos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(matchData)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.msg || 'Error al crear partido');
    }
    return await response.json();
};

export const getMyMatchesAPI = async () => {
    const response = await fetch(`${API_BASE_URL}/partidos/mis-partidos`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener mis partidos');
    return await response.json();
};

// ... (Mantén las otras funciones: getMatches, join, etc.)