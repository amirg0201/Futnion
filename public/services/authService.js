import { API_BASE_URL } from './config.js';

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    return response;
};

export const registerUser = async (userData) => {

    const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response;
};