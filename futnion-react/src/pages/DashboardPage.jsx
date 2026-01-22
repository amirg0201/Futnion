// src/pages/DashboardPage.jsx
import { useMyMatches } from '../hooks/useMyMatches';
import MatchCard from '../components/MatchCard';

const DashboardPage = () => {
  const { matches, loading, handleDelete } = useMyMatches();

  if (loading) return <p>Cargando tus partidos...</p>;

  return (
    <div>
      <h1>📊 Mis Partidos Creados y Unidos</h1>
      {matches.length === 0 ? (
        <p>No tienes partidos activos.</p>
      ) : (
        <div className="matches-grid">
          {matches.map(match => (
            <MatchCard 
              key={match._id} 
              match={match} 
              // Pasamos la función de borrar por si la tarjeta es nuestra
              // (El componente MatchCard decidirá si mostrar el botón o no)
              onDelete={() => handleDelete(match._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;