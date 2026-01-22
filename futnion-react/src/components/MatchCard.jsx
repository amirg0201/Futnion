// src/components/MatchCard.jsx
import { useAuth } from '../hooks/useAuth';

const MatchCard = ({ match, onJoin, onDelete }) => {
    const { user } = useAuth(); // Obtenemos al usuario globalmente
    
    // --- Lógica de la Fábrica (Factory Logic) ---
    // Determinamos el rol del usuario frente a ESTE partido específico
    const currentUserId = user?.userId;
    
    // A veces mongo devuelve el objeto completo (_id) o solo el string ID
    const isCreator = (match.creator?._id === currentUserId) || (match.creator === currentUserId);
    
    const isJoined = match.participants.some(p => {
        const pId = p._id || p;
        return pId === currentUserId;
    });

    const isAdmin = user?.role === 'admin';
    const spotsLeft = match.requiredPlayers - match.participants.length;
    const isFull = spotsLeft <= 0;

    // --- Renderizado Condicional (Strategy) ---
    const renderActions = () => {
        // 1. Estrategia para el Creador
        if (isCreator) {
          return (
            <div className="actions">
              <span className="badge creator">👑 Es tuyo</span>
              {/* Solo mostramos el botón de borrar si la página padre nos pasó la función */}
              {onDelete && (
                <button 
                  onClick={() => onDelete(match._id)} 
                  className="btn-delete"
                  title="Eliminar partido"
                >
                  🗑️ Borrar
                </button>
              )}
            </div>
          );
        }

        // 2. Estrategia para el Jugador ya unido
        if (isJoined) {
          return (
            <div className="actions">
              <span className="badge joined">✅ Estás dentro</span>
              {/* Aquí podrías agregar un botón onLeave si quisieras */}
            </div>
          );
        }

        // 3. Estrategia para Admin (que no es creador)
        if (isAdmin) {
            return (
            <div className="actions">
              <button onClick={() => onJoin(match._id)} className="btn-join">Unirme</button>
              {onDelete && <button onClick={() => onDelete(match._id)} className="btn-delete">🗑️ (Admin)</button>}
            </div>
          );
        }

        // 4. Estrategia Estándar (Visitante)
        return (
            <button 
              onClick={() => onJoin && onJoin(match._id)} 
              disabled={isFull}
              className={`btn-join ${isFull ? 'disabled' : ''}`}
            >
              {isFull ? 'Lleno 🚫' : '⚽ Unirme'}
            </button>
        );
    };

    return (
      <div className={`match-card ${isCreator ? 'my-match-card' : ''}`}>
        <div className="card-header">
          <h3>{match.MatchName}</h3>
          <span className="match-time">{new Date(match.MatchDate).toLocaleString()}</span>
        </div>
        
        <div className="card-body">
          <p>📍 <strong>Lugar:</strong> {match.LocationName}</p>
          <p>⏱ <strong>Duración:</strong> {match.MatchDuration}h</p>
          <p>👥 <strong>Cupos:</strong> {spotsLeft} disponibles</p>
        </div>

        <div className="card-footer">
          {renderActions()}
        </div>
      </div>
    );
};

export default MatchCard;