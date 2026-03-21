# UTN Buddy — TODO / User Stories

> 🎯 Stack final
> Monorepo pnpm powered by turborepo
> Frontend: React + Vite + Tailwind + NachUI
> Backend: NestJS
> DB: Supabase (PostgreSQL)
> ORM: Drizzle
> Storage: Supabase Storage
> IA: Vercel AI SDK + Gemini
> Auth: OAuth manual (Google + GitHub) con NestJS o usar Better Auth // Me inclino por Better Auth

---

# 🧱 MVP (PRIORIDAD MÁXIMA)

## 🔐 Auth (OAuth)

### 🔑 Login

- [ ] Como usuario, quiero iniciar sesión con Google
- [ ] Como usuario, quiero iniciar sesión con GitHub
- [ ] Como usuario, quiero ser redirigido correctamente después del login

---

### ⚙️ Backend OAuth (NestJS)

- [ ] Configurar Passport en NestJS
- [ ] Implementar Google Strategy
- [ ] Implementar GitHub Strategy

---

### 🔄 Flujo OAuth

- [ ] Endpoint: GET /auth/google
- [ ] Endpoint: GET /auth/google/callback

- [ ] Endpoint: GET /auth/github
- [ ] Endpoint: GET /auth/github/callback

---

### 🧠 Manejo de usuario

- [ ] Obtener datos del provider (email, name, avatar)
- [ ] Verificar si el usuario existe en DB
- [ ] Si no existe → crearlo con Drizzle
- [ ] Si existe → reutilizar

---

### 🔐 Sesión / Tokens

- [ ] Generar JWT propio en NestJS
- [ ] Enviar JWT al frontend
- [ ] Guardar token en frontend (cookie o localStorage)

---

### 🛡️ Protección de rutas

- [ ] Crear AuthGuard en NestJS
- [ ] Validar JWT en cada request
- [ ] Obtener user desde token
- [ ] Inyectar user en request

---

# 📊 Dashboard

- [ ] Como usuario, quiero ver mis materias en un dashboard
- [ ] Como usuario, quiero acceder rápidamente a cada materia
- [ ] Como usuario, quiero ver actividad reciente

---

# 📚 Materias (Subjects)

- [ ] Como usuario, quiero crear una materia
- [ ] Como usuario, quiero editar una materia
- [ ] Como usuario, quiero eliminar una materia
- [ ] Como usuario, quiero ver el detalle de una materia

---

## 🧠 Materias inteligentes

- [ ] Detectar automáticamente tipo de materia
- [ ] Clasificar como:
  - teórica
  - práctica
  - mixta

---

# 📄 Archivos / Apuntes

- [ ] Como usuario, quiero subir PDFs
- [ ] Como usuario, quiero ver archivos por materia
- [ ] Como usuario, quiero eliminar archivos

---

## 📦 Supabase Storage

- [ ] Crear bucket
- [ ] Subir archivos desde frontend
- [ ] Guardar URL en DB
- [ ] Restringir acceso por usuario

---

# 🧠 Procesamiento de PDFs (MVP SIMPLE)

- [ ] Extraer texto del PDF (backend)
- [ ] Limpiar texto
- [ ] Guardar texto en DB

> ❗ MVP:

- [ ] NO usar embeddings todavía

---

# 🧠 Chat IA (CORE)

- [ ] Como usuario, quiero chatear con IA dentro de una materia
- [ ] Como usuario, quiero que la IA use mis apuntes como contexto
- [ ] Como usuario, quiero ver historial de mensajes

---

# 🤖 Backend IA (NestJS + Vercel AI SDK + Gemini)

- [ ] Crear endpoint POST /chat
- [ ] Integrar Vercel AI SDK
- [ ] Configurar Gemini
- [ ] Construir prompt con:
  - contexto de materia
  - contenido de PDFs
- [ ] Enviar request a Gemini
- [ ] Devolver respuesta

---

# 💬 Persistencia de chat

- [ ] Crear chat por materia
- [ ] Guardar mensajes (user / assistant)
- [ ] Recuperar historial

---

# 🔄 Flujo completo

- [ ] Frontend envía mensaje con JWT
- [ ] Backend valida usuario
- [ ] Backend obtiene:
  - materia
  - archivos
- [ ] Backend construye contexto
- [ ] IA responde
- [ ] Se guarda mensaje
- [ ] Se devuelve respuesta

---

# 🧠 Base de datos (Drizzle)

## Tablas

- [ ] users
- [ ] subjects
- [ ] files
- [ ] chats
- [ ] messages

---

## 🧩 Usuarios (IMPORTANTE OAuth)

- [ ] Guardar:
  - provider (google/github)
  - provider_id
  - email
  - name
  - avatar

---

## Relaciones

- [ ] user → subjects
- [ ] subject → files
- [ ] subject → chats
- [ ] chat → messages

---

# 🎨 Frontend (React + Vite + NachUI)

## Auth UI

- [ ] Botón "Login con Google"
- [ ] Botón "Login con GitHub"
- [ ] Manejar redirect después de login
- [ ] Guardar JWT

---

## Layout

- [ ] Sidebar
- [ ] App shell
- [ ] Routing

---

## 📊 Dashboard UI

- [ ] Grid de materias
- [ ] Actividad reciente

---

## 📚 Subjects UI

- [ ] Lista de materias
- [ ] Crear materia
- [ ] Empty state

---

## 📄 Subject Detail

- [ ] Layout:
  - izquierda → archivos
  - derecha → chat

---

## 💬 Chat UI

- [ ] Lista de mensajes
- [ ] Input fijo
- [ ] Loading state
- [ ] Error state

---

## 📄 Upload UI

- [ ] Drag & drop
- [ ] Lista de archivos
- [ ] Estado de subida

---

# 🚀 POST-MVP

## 🧠 IA avanzada

- [ ] Resúmenes
- [ ] Preguntas tipo examen
- [ ] Ejercicios
- [ ] Explicaciones adaptativas

---

# 🏁 DEFINICIÓN DE DONE (MVP)

- [ ] Usuario loguea con Google o GitHub
- [ ] JWT funcionando
- [ ] Puede crear materias
- [ ] Puede subir PDFs
- [ ] Puede chatear con IA
- [ ] IA responde con contexto básico

---

# 🧠 NOTAS IMPORTANTES

- OAuth solo para login (no passwords)
- Backend genera JWT propio
- No confiar en frontend nunca
- Mantener simple el flujo de IA al inicio
