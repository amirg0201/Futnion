// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importamos tu hook personalizado

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Si NO está autenticado, lo redirigimos al Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si SÍ está autenticado, dejamos que vea el contenido (el hijo)
    return children;
};