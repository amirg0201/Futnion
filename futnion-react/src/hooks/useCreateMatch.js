// src/hooks/useCreateMatch.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatchAPI } from '../services/matchService';
import matchValidator from '../utils/MatchValidator'; // OCP: Validador externo

export const useCreateMatch = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        MatchName: '',
        LocationName: '',
        MatchDate: '',
        MatchDuration: 1,
        PlayersBySide: 5,
        requiredPlayers: 10
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitMatch = async (e) => {
        e.preventDefault();
        
        // 1. Preparar datos (Conversión de tipos)
        const dataToValidate = {
            ...formData,
            MatchDuration: parseFloat(formData.MatchDuration),
            PlayersBySide: parseInt(formData.PlayersBySide),
            requiredPlayers: parseInt(formData.requiredPlayers)
        };

        // 2. Validación OCP (Sin if/else duros aquí)
        const error = matchValidator.validate(dataToValidate);
        if (error) {
            alert(error); // O podrías usar un estado de error
            return;
        }

        // 3. Envío al Servicio
        try {
            setLoading(true);
            await createMatchAPI(dataToValidate);
            alert('✅ Partido creado exitosamente');
            navigate('/dashboard'); // Redirigir a "Mis Partidos"
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, submitMatch, loading };
};