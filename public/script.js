document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.querySelector('.form-container');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterLink = document.getElementById('show-register-link');
  const showLoginLink = document.getElementById('show-login-link');
  
  // --- Elementos de la App (se inicializan después) ---
  let appContainer, homePage, createPage, navHome, navCreate, navLogout, createMatchForm, matchesListDiv;
  let modalContainer, modalBody, modalClose;
  
  // --- Lógica para cambiar entre formularios ---
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // --- LÓGICA DE LOGIN ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      
      loginContainer.classList.add('hidden');
      
      setupApp(); // <-- Esta función ahora también prepara el modal
      appContainer.classList.remove('hidden');
      loadMatches();
      } else {
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error('Error en el login:', error);
      alert('No se pudo conectar con el servidor.');
    }
  });

  // --- FUNCIÓN PARA CARGAR PARTIDOS ---
  async function loadMatches() {
      const currentUserId = localStorage.getItem('userId');
      matchesListDiv.innerHTML = "Cargando partidos...";

      try {
          const response = await fetch('/api/partidos');
          if (!response.ok) throw new Error('Error al cargar partidos');
          const matches = await response.json();
          
          if (matches.length === 0) {
            // ... (sin cambios)
            return;
          }

          // (El código de `matches.map` ahora es más simple)
          matchesListDiv.innerHTML = matches.map(match => {
            const spotsLeft = match.requiredPlayers - match.participants.length;
            const isCreator = match.creator && (match.creator._id === currentUserId);
            
            const cardClass = isCreator ? 'match-card my-match' : 'match-card';
            const creatorTag = isCreator ? '<span class="creator-tag">Mío</span>' : '';

            // ¡Ya NO mostramos la lista de participantes aquí!

            // --- HTML de la tarjeta (resumen) ---
            return `
              <div class="${cardClass}" data-id="${match._id}">
                <h3>${match.MatchName} ${creatorTag}</h3>
                <p><strong>Lugar:</strong> ${match.LocationName}</p>
                <p><strong>Organizador:</strong> ${match.creator ? match.creator.username : 'Sistema'}</p>
                <p><strong>Cupos Faltantes:</strong> ${spotsLeft}</p>
                
                <button class="join-btn" data-id="${match._id}" ${ (spotsLeft <= 0 || isCreator) ? 'disabled' : '' }>
                  ${ isCreator ? 'Eres el creador' : (spotsLeft <= 0 ? 'Lleno' : 'Unirme') }
                </button>
              </div>
            `;
          }).join('');

          // --- Lógica de Clics (Actualizada) ---

          // 1. Clic en el botón "Unirme"
          document.querySelectorAll('.join-btn').forEach(button => {
            button.addEventListener('click', (e) => {
              e.stopPropagation(); // ¡Importante! Evita que el clic "atraviese" al contenedor
              const matchId = e.target.dataset.id;
              joinMatch(matchId);
            });
          });

          // 2. Clic en la tarjeta (para "Ver Más")
          document.querySelectorAll('.match-card').forEach(card => {
            card.addEventListener('click', (e) => {
              // Si se hizo clic en el botón, no hacemos nada
              if (e.target.closest('.join-btn')) return;

              const matchId = card.dataset.id;
              showMatchDetails(matchId);
            });
          });

      } catch (error) {
        matchesListDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
      }
  }

  // --- LÓGICA DE REGISTRO ---
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const userData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/usuarios', { // Endpoint de registro
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        // Cambiamos al formulario de login
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginForm.reset(); // Limpiamos los campos
      } else {
        alert(`Error en el registro: ${data.msg || data.error}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor.');
    }
  });

  // --- NUEVA FUNCIÓN: Unirse a un Partido ---

  async function joinMatch(matchId) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Tu sesión ha expirado, por favor inicia sesión de nuevo.');
      return;
    }

    try {
      const response = await fetch(`/api/partidos/${matchId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            // ¡Enviamos el token para la autenticación!
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Te has unido al partido!');
        loadMatches(); // Recargamos la lista de partidos
      } else {
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      alert('Error de red al intentar unirse.');
    }
  }

  async function createMatch(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Tu sesión ha expirado');

    const matchData = {
      MatchName: document.getElementById('match-name').value,
      LocationName: document.getElementById('match-location').value,
      MatchDate: document.getElementById('match-date').value,
      PlayersBySide: parseInt(document.getElementById('match-players-side').value),
      requiredPlayers: parseInt(document.getElementById('match-required').value)
    };

    try {
      const response = await fetch('/api/partidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(matchData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Error al crear el partido');

      alert('¡Partido creado con éxito!');
      createMatchForm.reset();
      
      // ¡NUEVO! Te mandamos al Home después de crear
      navHome.click(); 
    } catch (error) {
      alert(error.message);
    }
  }

  async function showMatchDetails(matchId) {
    try {
      // 1. Mostrar el modal con un "cargando"
      modalBody.innerHTML = 'Cargando...';
      modalContainer.classList.remove('hidden');

      // 2. Buscar la info completa de ESE partido
      // (Esta ruta ya la teníamos en el backend)
      const response = await fetch(`/api/partidos/${matchId}`);
      if (!response.ok) throw new Error('No se pudo cargar la información del partido.');
      
      const match = await response.json();

      // 3. Formatear la fecha
      const matchDate = new Date(match.MatchDate).toLocaleString('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      });

      // 4. Crear la lista de participantes
      let participantsList;
      if (match.participants.length > 0) {
        participantsList = match.participants
          .map(user => `<li class="participant-item">${user ? user.username : 'Usuario no encontrado'}</li>`)
          .join('');
      } else {
        participantsList = '<li>Aún no hay jugadores inscritos.</li>';
      }

      // 5. Construir el HTML final
      const html = `
        <h3>${match.MatchName}</h3>
        <p><strong>Cuándo:</strong> ${matchDate}</p>
        <p><strong>Dónde:</strong> ${match.LocationName}</p>
        <p><strong>Formato:</strong> ${match.PlayersBySide} vs ${match.PlayersBySide}</p>
        <p><strong>Organizador:</strong> ${match.creator.username}</p>
        
        <div class="participants-container">
          <strong>Inscritos (${match.participants.length} / ${match.requiredPlayers}):</strong>
          <ul class="participants-list">
            ${participantsList}
          </ul>
        </div>
      `;
      
      // 6. Insertar el HTML en el modal
      modalBody.innerHTML = html;

    } catch (error) {
      modalBody.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
  }

function setupApp() {
      // Obtenemos los elementos de la app (ahora que existen)
    appContainer = document.getElementById('app-container');
    homePage = document.getElementById('home-page');
    createPage = document.getElementById('create-page');
    navHome = document.getElementById('nav-home');
    navCreate = document.getElementById('nav-create');
    navLogout = document.getElementById('nav-logout');
    createMatchForm = document.getElementById('create-match-form');
    matchesListDiv = document.getElementById('matches-list');
    modalContainer = document.getElementById('modal-container');
    modalBody = document.getElementById('modal-body');
    modalClose = document.getElementById('modal-close');

    modalClose.addEventListener('click', () => modalContainer.classList.add('hidden'));
    modalContainer.addEventListener('click', (e) => {
      // Cierra si se hace clic en el fondo oscuro
      if (e.target === modalContainer) {
        modalContainer.classList.add('hidden');
      }
    });
    // Navegación
    navHome.addEventListener('click', () => {
      homePage.classList.remove('hidden');
      createPage.classList.add('hidden');
      navHome.classList.add('active');
      navCreate.classList.remove('active');
      loadMatches(); // Recarga los partidos
    });

    navCreate.addEventListener('click', () => {
      homePage.classList.add('hidden');
      createPage.classList.remove('hidden');
      navHome.classList.remove('active');
      navCreate.classList.add('active');
    });

    navLogout.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.reload(); // Recarga la página (volverá al login)
    });

    // Asignar evento al formulario de creación
    createMatchForm.addEventListener('submit', createMatch);
  }
});