// src/utils/MatchValidator.js

class MatchValidator {
    constructor() {
      this.rules = [];
    }

    // Método para agregar reglas (Extensión - OCP)
    addRule(ruleFunction) {
      this.rules.push(ruleFunction);
    }

    // Método para validar (Cerrado a modificación)
    validate(matchData) {
      for (const rule of this.rules) {
        const error = rule(matchData);
        if (error) return error; // Retorna el primer error encontrado
      }
      return null; // Todo OK
    }
}

// --- REGLAS DE NEGOCIO ---

const durationRule = (data) => {
  if (isNaN(data.MatchDuration) || data.MatchDuration <= 0) {
    return "Ingresa una duración válida (ej: 1 o 1.5).";
  }
  return null;
};

const playersRule = (data) => {
  if (data.PlayersBySide < 1 || isNaN(data.PlayersBySide)) {
    return "Debe haber al menos 1 jugador por equipo.";
  }
  return null;
};

const nameRule = (data) => {
  if (!data.MatchName || data.MatchName.trim().length < 3) {
      return "El nombre del partido es muy corto.";
  }
  return null;
};

const requiredPlayersRule = (data) => {
  if (data.requiredPlayers < 2) {
      return "El cupo total debe ser al menos para 2 personas.";
  }
  return null;
};

// --- INSTANCIA Y CONFIGURACIÓN ---
const matchValidator = new MatchValidator();

matchValidator.addRule(nameRule);
matchValidator.addRule(durationRule);
matchValidator.addRule(playersRule);
matchValidator.addRule(requiredPlayersRule);

// Exportamos la instancia lista para usar
export default matchValidator;