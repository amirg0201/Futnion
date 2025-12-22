// public/utils/MatchValidator.js

class MatchValidator {
    constructor() {
        this.rules = [];
    }

    // Método para agregar nuevas reglas sin modificar la clase (Abierto a extensión)
    addRule(ruleFunction) {
        this.rules.push(ruleFunction);
    }

    // Método para validar (Cerrado a modificación)
    validate(matchData) {
        for (const rule of this.rules) {
            const error = rule(matchData);
            if (error) return error; // Retorna el primer error que encuentre
        }
        return null; // Todo OK
    }
}

// Definimos las reglas actuales
export const durationRule = (data) => 
    (isNaN(data.MatchDuration) || data.MatchDuration <= 0) 
        ? "La duración debe ser mayor a 0 horas." 
        : null;

export const playersRule = (data) => 
    (data.PlayersBySide < 1) 
        ? "Debe haber al menos 1 jugador por lado." 
        : null;

export const nameRule = (data) =>
    (!data.MatchName || data.MatchName.trim().length < 3)
        ? "El nombre del partido es muy corto."
        : null;

// Exportamos una instancia lista para usar
const matchValidator = new MatchValidator();
matchValidator.addRule(nameRule);
matchValidator.addRule(durationRule);
matchValidator.addRule(playersRule);

export default matchValidator;