import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/protectedRoute';
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // (Donde listas todos)
import CreateMatchPage from './pages/CreateMatchPage';
import DashboardPage from './pages/DashboardPage';

// Layout para páginas internas
const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="container" style={{ padding: '20px' }}>{children}</div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas Protegidas */}
          <Route path="/" element={<ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="/crear" element={<ProtectedRoute><Layout><CreateMatchPage /></Layout></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;