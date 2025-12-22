// components/MatchCard.js

// ==========================================
// 1. EL MOLDE BASE (DRY - Don't Repeat Yourself)
// ==========================================
// Esta función solo sabe pintar HTML, no toma decisiones.
const renderCardTemplate = (match, badgeHtml, buttonsHtml) => {
    return `
        <div class="match-card ${badgeHtml ? 'my-match' : ''}" data-id="${match._id}">
            <h3>${match.MatchName} ${badgeHtml}</h3>
            <p><strong>Lugar:</strong> ${match.LocationName}</p>
            <p><strong>Duración:</strong> ${match.MatchDuration || 1} horas</p>
            <p><strong>Organizador:</strong> ${match.creator ? match.creator.username : 'Sistema'}</p>
            <p><strong>Cupos Faltantes:</strong> ${match.requiredPlayers - match.participants.length}</p>
            
            <div class="card-actions">
                ${buttonsHtml}
            </div>
        </div>
    `;
};

// ==========================================
// 2. LOS "OBREROS" (Estrategias Concretas)
// ==========================================
// Cada función crea un tipo específico de tarjeta.

const createCreatorCard = (match) => {
    // El dueño ve la etiqueta "Mío" y el botón de borrar
    const badge = '<span class="creator-tag">Mío</span>';
    const buttons = `
        <button class="join-btn" disabled>Eres el creador</button>
        <button class="delete-btn" data-id="${match._id}">🗑️</button>
    `;
    return renderCardTemplate(match, badge, buttons);
};

const createParticipantCard = (match) => {
    // El jugador unido ve el botón de "Salir" (Amarillo/Rojo)
    const buttons = `
        <button class="leave-match-btn" data-id="${match._id}">Salir del Partido</button>
    `;
    return renderCardTemplate(match, '', buttons);
};

const createAdminCard = (match) => {
    // El admin ve botón de unirse normal + Botón de borrar (Poder especial)
    const buttons = `
        <button class="join-btn" data-id="${match._id}">Unirme</button>
        <button class="delete-btn" data-id="${match._id}" title="Borrar como Admin">🗑️ (Admin)</button>
    `;
    return renderCardTemplate(match, '', buttons);
};

const createStandardCard = (match) => {
    // Tarjeta normal para usuario que busca partido
    const spotsLeft = match.requiredPlayers - match.participants.length;
    const isFull = spotsLeft <= 0;
    
    const btnText = isFull ? 'Lleno' : 'Unirme';
    const disabled = isFull ? 'disabled' : '';
    
    const buttons = `
        <button class="join-btn" data-id="${match._id}" ${disabled}>${btnText}</button>
    `;
    return renderCardTemplate(match, '', buttons);
};

// ==========================================
// 3. LA FÁBRICA (Factory Method)
// ==========================================
// Esta es la ÚNICA función que exportamos. Decide qué obrero llamar.

export const createMatchCard = (match, currentUserId) => {
    const userRole = localStorage.getItem('userRole');
    
    // --- Lógica de Decisión ---
    
    // 1. ¿Es el creador? (Prioridad máxima visual)
    if (match.creator && match.creator._id === currentUserId) {
        return createCreatorCard(match);
    }

    // 2. ¿Ya está unido?
    const isJoined = match.participants.some(p => {
        const id = p._id || p; 
        return id === currentUserId;
    });
    if (isJoined) {
        return createParticipantCard(match);
    }

    // 3. ¿Es Admin? (Tiene poderes de borrado aunque no sea suyo)
    if (userRole === 'admin') {
        return createAdminCard(match);
    }

    // 4. Caso por defecto (Usuario normal buscando jugar)
    return createStandardCard(match);
};