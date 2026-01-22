// src/hooks/useMyMatches.js
import { useState, useEffect } from 'react';
import { getMyMatchesAPI, deleteMatchAPI } from '../services/matchService'; // Asumiendo que tienes delete

export const useMyMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await getMyMatchesAPI();
            setMatches(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el borrado y actualizar la lista localmente
    const handleDelete = async (matchId) => {
        if (!confirm('¿Seguro que quieres borrar este partido?')) return;
        try {
            await deleteMatchAPI(matchId); // Asegúrate de tener esto en matchService
            // Actualización optimista: Filtramos la lista local
            setMatches(prev => prev.filter(m => m._id !== matchId));
        } catch (error) {
            alert('Error al borrar', error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { matches, loading, handleDelete };
};