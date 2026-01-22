import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">Futnion React ⚛️</div>
      <div className="nav-links">
        <Link to="/">Explorar</Link>
        <Link to="/dashboard">Mis Partidos</Link>
        <Link to="/crear" className="btn-create">➕ Crear</Link>
        <button onClick={logout} className="btn-logout">Salir ({user?.role})</button>
      </div>
    </nav>
  );
};
export default Navbar;