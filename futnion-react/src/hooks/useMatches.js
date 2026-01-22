// src/hooks/useMatches.js
import { useState, useEffect } from 'react';
import { getMatches } from '../services/matchService'; // Asegúrate de tener esta función en tu servicio
import { joinMatchAPI } from '../services/matchService'; 

export const useMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMatches = async () => {
        try {
            setLoading(true);
            const data = await getMatches();
            setMatches(data);
        } catch (error) {
            console.error("Error cargando partidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (matchId) => {
        try {
            await joinMatchAPI(matchId);
            alert('¡Te has unido al partido!');
            loadMatches(); // Recargamos la lista para ver el cambio
        } catch (error) {
            alert('Error al unirse: ' + error.message);
        }
    };

    useEffect(() => {
        loadMatches();
    }, []);

    return { matches, loading, handleJoin };
};