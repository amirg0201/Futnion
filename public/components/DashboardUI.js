// public/components/DashboardUI.js

/**
 * Inicializa todos los event listeners y maneja la navegación de la interfaz.
 * @param {object} elements - Referencias a los elementos del DOM.
 * @param {object} handlers - Funciones de lógica de datos importadas de main.js.
 */
export const initializeDashboardUI = (elements, handlers) => {

    // --- Lógica de Navegación (TRASLADADA de main.js) ---

    // Home
    elements.navHome.addEventListener('click', () => {
        elements.homePage.classList.remove('hidden');
        elements.createPage.classList.add('hidden');
        elements.navHome.classList.add('active');
        elements.navCreate.classList.remove('active');
        handlers.loadMatches(); // Llama a la función que main.js nos proporciona
    });

    // Crear Partido
    elements.navCreate.addEventListener('click', () => {
        elements.homePage.classList.add('hidden');
        elements.createPage.classList.remove('hidden');
        elements.navHome.classList.remove('active');
        elements.navCreate.classList.add('active');
    });

    // Cerrar Sesión
    elements.navLogout.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.reload(); 
    });

    // --- Cierre de Modal (TRASLADADO de main.js) ---
    elements.modalClose.addEventListener('click', () => {
        elements.modalContainer.classList.add('hidden');
    });
    elements.modalContainer.addEventListener('click', (e) => {
        if (e.target === elements.modalContainer) {
            elements.modalContainer.classList.add('hidden');
        }
    });

    // --- Conexión de Formularios (TRASLADADO de main.js) ---
    // Conecta el formulario a la función de lógica de datos.
    elements.createMatchForm.addEventListener('submit', handlers.createMatch);
};