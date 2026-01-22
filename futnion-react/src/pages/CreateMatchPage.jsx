// src/pages/CreateMatchPage.jsx
import { useCreateMatch } from '../hooks/useCreateMatch';

const CreateMatchPage = () => {
    // Inyección de dependencias (Hook)
    const { formData, handleChange, submitMatch, loading } = useCreateMatch();

    return (
      <div className="form-container">
        <h2>⚽ Crear Nuevo Partido</h2>
        <form onSubmit={submitMatch}>
          <div className="input-group">
            <label>Nombre del Partido</label>
            <input name="MatchName" value={formData.MatchName} onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label>Ubicación</label>
            <input name="LocationName" value={formData.LocationName} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Fecha y Hora</label>
            <input type="datetime-local" name="MatchDate" value={formData.MatchDate} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Duración (Horas)</label>
            <input type="number" name="MatchDuration" value={formData.MatchDuration} onChange={handleChange} min="0.5" step="0.5" />
          </div>

          <div className="input-group">
            <label>Jugadores por Lado</label>
            <input type="number" name="PlayersBySide" value={formData.PlayersBySide} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Partido'}
          </button>
        </form>
      </div>
    );
};

export default CreateMatchPage;