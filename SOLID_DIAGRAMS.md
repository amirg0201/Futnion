# 📐 Arquitectura SOLID - Diagrama Visual

## Flujo de Dependencias - Usuario Login

```
HTTP Request: POST /api/usuarios/login
    │
    ├─────────────────────────────────────────┐
    │                                         │
    v                                         │
┌─────────────────────────────────────────┐   │
│         UserRoutes.js                   │   │
│  (Inyecta: userAuthService, auth)       │   │
└────────────┬────────────────────────────┘   │
             │                                 │
             v                                 │
    ┌────────────────────────────────────┐    │
    │   UserController.loginUser()       │◄───┘
    │  - Extrae email, password          │
    │  - Delega a userAuthService        │
    └────────┬─────────────────────────┘
             │
             │ (DIP: Depende de abstracción)
             │
             v
    ┌────────────────────────────────────┐
    │  UserAuthService.login()           │
    │  - Busca usuario en BD             │
    │  - Delega comparación a ✓          │
    │  - Delega token a ✓                │
    └──────┬──────────────┬──────────────┘
           │              │
      ┌────v──────┐   ┌──v─────────────┐
      │ Password  │   │  TokenService  │
      │ Service   │   │  .generate()   │
      │ .compare()│   └────────────────┘
      └───────────┘
           ✓ true
             │
             v
    ┌────────────────────────────────────┐
    │  HTTP Response 200 OK              │
    │  { token, userId, role }           │
    └────────────────────────────────────┘
```

---

## Flujo de Dependencias - Crear Partido

```
HTTP Request: POST /api/partidos
    │
    │ + Header: Authorization: Bearer token
    │
    v
┌─────────────────────────────────────┐
│   auth middleware                   │
│  (inyectado: userCRUDService)       │
│  - Verifica JWT                     │
│  - Obtiene usuario                  │
│  - Adjunta a req.user              │
└────────┬─────────────────────────────┘
         │
         v
┌─────────────────────────────────────┐
│   MatchRoutes.js                    │
│  (Inyecta: matchCRUDService,        │
│             matchParticipantService,│
│             auth)                    │
└────────┬─────────────────────────────┘
         │
         v
┌─────────────────────────────────────┐
│  MatchController.createMatch()      │
│  - Prepara datos + creator ID       │
│  - Delega a matchCRUDService        │
└────────┬─────────────────────────────┘
         │
         v
┌─────────────────────────────────────┐
│  MatchCRUDService.createMatch()     │
│  - Valida datos                     │
│  - Guarda en BD                     │
└─────────────────────────────────────┘
         │
         v
   HTTP 201 Created
```

---

## Flujo de Dependencias - Unirse a Partido

```
HTTP Request: POST /api/partidos/:id/join
    │
    │ + Header: Authorization: Bearer token
    │
    v
┌──────────────────────────────────────┐
│   auth middleware                    │
│  (Valida y adjunta req.user)         │
└────────┬──────────────────────────────┘
         │
         v
┌──────────────────────────────────────┐
│  MatchController.joinMatch()         │
│  - Obtiene ID del partido            │
│  - Obtiene ID del usuario (req.user) │
│  - Delega a matchParticipantService  │
└────────┬──────────────────────────────┘
         │
         v
┌──────────────────────────────────────────┐
│  MatchParticipantService.joinMatch()     │
│  - Obtiene partido de BD                 │
│  - Delega validaciones a ✓               │
│  - Si OK: añade participante             │
└────────┬─────────────┬──────────────────┘
         │             │
    ┌────v──────┐  ┌──v──────────────────┐
    │ Busca en  │  │ MatchValidation     │
    │ Match.    │  │ Service             │
    │ findById()│  │ .validateCanJoin()  │
    └───────────┘  │                      │
                   │ Validaciones:        │
                   │ - ¿Creador? NO      │
                   │ - ¿Ya inscrito? NO  │
                   │ - ¿Espacio? SÍ      │
                   └──────────────────────┘
                           ✓ OK
         │
         v
  match.participants.push(userId)
  match.save()
         │
         v
   HTTP 200 OK
```

---

## Diagrama de Clases SOLID

```
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE ENRUTAMIENTO                       │
├─────────────────────────────────────────────────────────────┤
│  UserRoutes(userAuthService, userCRUDService, auth)         │
│  MatchRoutes(matchCRUDService, matchParticipantService, auth)
└────────────────┬─────────────────────────────────────────────┘
                 │
                 │ (DIP: Inyecta)
                 │
         ┌───────┴──────────────────┐
         │                          │
         v                          v
   ┌──────────────┐         ┌──────────────┐
   │ UserControl  │         │ MatchControl │
   │ -loginUser() │         │ -joinMatch() │
   │ -createUser()│         │ -createMatch()
   │ -getUsers()  │         │ -leaveMatch()
   │ -updateUser()│         │ -deleteMatch()
   └─────┬────────┘         └──────┬────────┘
         │                         │
         │ (DIP: Delega)           │ (DIP: Delega)
         │                         │
    ┌────┴──────────────┐    ┌─────┴──────────────────┐
    │                   │    │                        │
    v                   v    v                        v
┌─────────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
│ UserAuth       │ │ UserCRUD    │ │ MatchCRUD   │ │ MatchPart-   │
│ Service        │ │ Service     │ │ Service     │ │ icipant      │
│ +register()    │ │ +getAll()   │ │ +create()   │ │ Service      │
│ +login()       │ │ +getById()  │ │ +getAll()   │ │ +joinMatch() │
└──────┬─────────┘ │ +update()   │ │ +getById()  │ │ +leaveMatch()│
       │           │ +delete()   │ │ +update()   │ │              │
       │           │             │ │ +delete()   │ │              │
       │           │             │ │ +deleteAny()│ │              │
       │           └─────────────┘ └─────────────┘ └──────┬───────┘
       │                                                   │
       │ (DIP: Inyecta) │                                  │
       │                │                                  │ (DIP: Inyecta)
   ┌───┴────┐           │                          ┌──────v──────────┐
   │         │           │                          │                 │
   v         v           │                          v                 v
┌──────┐ ┌───────────┐   │                   ┌────────────────┐ ┌──────────────┐
│Pass- │ │ Token    │   │                   │ MatchValidation│ │ Match        │
│word  │ │ Service  │   │                   │ Service        │ │ CRUD (again) │
│Serv. │ │ +generate │   │                   │ +validateCanJoin│ │              │
│      │ │ +verify() │   │                   │ +validateCanLeave│ │              │
└──────┘ └───────────┘   │                   │ +isCreator()   │ │              │
                         │                   └────────────────┘ └──────────────┘
                         │
                    ┌────v─────────┐
                    │ UserCRUD     │
                    │ Service      │
                    │ (usado aquí) │
                    └──────────────┘

LEYENDA:
→ Depende de (DIP)
─ Utiliza
```

---

## Inyección de Dependencias en Cascada

```
app.js (Punto Central)
│
├─ Crear instancias básicas
│  ├─ passwordService = new PasswordService()
│  ├─ tokenService = new TokenService()
│  ├─ matchValidationService = new MatchValidationService()
│  └─ userCRUDService = new UserCRUDService()
│
├─ Inyectar en servicios complejos
│  ├─ userAuthService = new UserAuthService(
│  │                    passwordService,
│  │                    tokenService)
│  │
│  ├─ matchParticipantService = new MatchParticipantService(
│  │                            matchValidationService)
│  │
│  └─ matchCRUDService = new MatchCRUDService(
│                        matchValidationService)
│
├─ Inyectar en controladores
│  ├─ userController = new UserController(
│  │                   userAuthService,
│  │                   userCRUDService)
│  │
│  └─ matchController = new MatchController(
│                       matchCRUDService,
│                       matchParticipantService)
│
├─ Inyectar en middleware
│  └─ auth = authMiddleware(userCRUDService)
│
└─ Inyectar en rutas
   ├─ userRoutes(userAuthService, userCRUDService, auth)
   └─ matchRoutes(matchCRUDService, matchParticipantService, auth)
```

---

## Comparativa: Antes vs Después

### ANTES ❌

```
┌─────────────────────────────────────┐
│      UserService (90 líneas)        │
│                                     │
│  • hashPassword()      ← PasswordServ│
│  • comparePasswords()  ← PasswordServ│
│  • generateToken()     ← TokenService│
│  • verifyToken()       ← TokenService│
│  • register()          ← Auth logic │
│  • login()             ← Auth logic │
│  • getAllUsers()       ← CRUD       │
│  • getUserById()       ← CRUD       │
│  • updateUser()        ← CRUD       │
│  • deleteUser()        ← CRUD       │
│                                     │
│  PROBLEMAS:                         │
│  ❌ Múltiples responsabilidades    │
│  ❌ Difícil de testear             │
│  ❌ Difícil de reutilizar           │
│  ❌ Cambios afectan todo           │
└─────────────────────────────────────┘
```

### DESPUÉS ✅

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Password     │  │ Token        │  │ UserAuth     │  │ UserCRUD     │
│ Service      │  │ Service      │  │ Service      │  │ Service      │
│              │  │              │  │              │  │              │
│ • hash()     │  │ • generate() │  │ • register() │  │ • getAll()   │
│ • compare()  │  │ • verify()   │  │ • login()    │  │ • getById()  │
│              │  │              │  │              │  │ • update()   │
│ (SRP)        │  │ (SRP)        │  │ (SRP+DIP)    │  │ • delete()   │
│ 25 líneas    │  │ 30 líneas    │  │ 50 líneas    │  │ (SRP)        │
│              │  │              │  │              │  │ 40 líneas    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                                            ↑
                                      Orquesta:
                                      • hashPassword
                                      • generateToken
```

---

## Testing: Mockear es Ahora Trivial

```javascript
// Antes: Imposible sin una BD real
const userService = new UserService();
await userService.register(userData);  // Toca BD, bcrypt, JWT...

// Después: Trivial con mocks
const mockPasswordService = { 
    hashPassword: jest.fn(() => 'mocked')
};
const mockTokenService = { 
    generateToken: jest.fn(() => 'token')
};

const userAuthService = new UserAuthService(
    mockPasswordService,
    mockTokenService
);
await userAuthService.register(userData);  // SOLO lógica, sin BD
```

---

## Escalabilidad Futura

```
Quieres agregar autenticación con Google?
├─ Creas: GoogleAuthService
├─ Reutilizas: TokenService (ya existe)
├─ Reutilizas: UserCRUDService (ya existe)
└─ CERO cambios en código existente (OCP) ✓

Quieres cambiar BD de MongoDB a PostgreSQL?
├─ SOLO cambias: UserCRUDService
├─ NO cambias: UserAuthService, Controllers, Routes
└─ El resto es inmune a este cambio (SRP) ✓

Quieres agregar validación con Zod?
├─ Creas: ValidationService
├─ Lo inyectas en servicios que lo necesiten
└─ Los demás no se ven afectados (ISP) ✓
```

---

## Resumen

- **SRP**: Cada clase tiene UNA responsabilidad
- **OCP**: Extensible sin modificar existentes
- **LSP**: Servicios intercambiables
- **ISP**: Interfaces específicas
- **DIP**: Todo inyectado, acoplamiento débil

Tu código es ahora **profesional, testeable y escalable** 🚀
