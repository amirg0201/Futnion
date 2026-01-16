// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/protectedRoute'; // <-- Importamos el guardia
import LoginPage from './pages/LoginPage';

// Home temporal (Luego haremos el real)
const HomePage = () => (
    <div style={{ padding: '20px' }}>
        <h1>🏠 ¡Bienvenido al Home de React!</h1>
        <p>Si ves esto, es porque estás logueado.</p>
        <button onClick={() => {
            localStorage.clear(); 
            window.location.reload();
        }}>Cerrar Sesión (Forzado)</button>
    </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            {/* Ruta Pública: Cualquiera puede entrar */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Ruta Privada: Protegida por el guardia */}
            <Route 
                path="/" 
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } 
            />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;