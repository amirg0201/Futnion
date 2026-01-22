// src/pages/HomePage.jsx
import { useMatches } from '../hooks/useMatches';
import MatchCard from '../components/MatchCard';

const HomePage = () => {
    // 1. Usamos el Hook (DIP: Inversión de Dependencia)
    const { matches, loading, handleJoin } = useMatches();

    if (loading) return <div className="loading">Cargando partidos... ⚽</div>;

    return (
        <div>
            <h1>Explorar Partidos</h1>
            {matches.length === 0 ? (
                <p>No hay partidos disponibles. ¡Sé el primero en crear uno!</p>
            ) : (
                <div className="matches-grid">
                    {matches.map(match => (
                        <MatchCard 
                            key={match._id} 
                            match={match} 
                            // Pasamos la función de unirse (El Factory de la tarjeta decidirá si mostrar el botón)
                            onJoin={() => handleJoin(match._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;