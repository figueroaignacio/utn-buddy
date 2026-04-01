# UTN Buddy — Roadmap

## ✅ Setup & Infraestructura

- [x] ~~Monorepo con `apps/web` (React + Vite) y `apps/api` (FastAPI)~~
- [x] ~~pnpm como package manager~~
- [x] ~~concurrently para levantar ambos servidores con `pnpm run dev`~~
- [x] ~~Husky + Commitlint~~
- [x] ~~Git + .gitignore~~
- [x] ~~Ruff para linting/formatting de Python~~
- [x] ~~ESLint + Prettier para TypeScript~~

## ✅ Backend — Base

- [x] ~~FastAPI con arquitectura limpia (core, models, schemas, repositories, services, routers)~~
- [x] ~~Conexión a Supabase (PostgreSQL) con SQLAlchemy async~~
- [x] ~~Alembic para migraciones~~
- [x] ~~Variables de entorno con Pydantic Settings~~
- [x] ~~RLS activado en Supabase~~
- [x] ~~CORS configurado~~

## ✅ Backend — Auth

- [x] ~~Modelo de User con SQLAlchemy~~
- [x] ~~Schemas de Pydantic (UserCreate, UserResponse)~~
- [x] ~~Repository pattern para User~~
- [x] ~~Service pattern para User~~
- [x] ~~OAuth con Google~~
- [x] ~~OAuth con GitHub~~
- [x] ~~JWT generado con python-jose~~
- [x] ~~Cookie HTTP Only con el JWT~~
- [x] ~~Endpoint /auth/me con dependencia get_current_user~~
- [x] ~~Endpoint /auth/logout~~
- [x] ~~Redirect al frontend tras login exitoso~~

## ✅ Frontend — Base

- [x] ~~React + Vite + TypeScript~~
- [x] ~~React Router v7~~
- [x] ~~Zustand para estado global~~
- [x] ~~React Query para fetching~~
- [x] ~~Screaming architecture con /features~~
- [x] ~~Proxy de Vite al backend~~

## ✅ Frontend — Auth

- [x] ~~auth.api.ts con fetchMe, fetchGoogleLoginUrl, fetchGithubLoginUrl, logout~~
- [x] ~~auth.store.ts con Zustand~~
- [x] ~~useAuth hook con React Query~~
- [x] ~~ProtectedRoute~~
- [x] ~~LoginPage con botones de Google y GitHub~~
- [x] ~~DashboardPage básico~~
- [x] ~~Redireccionamiento post-login~~

---

## 🔲 Backend — Materias

- [ ] Modelo `Subject` (materia) — nombre, descripción, color, user_id
- [ ] Migración de la tabla subjects
- [ ] Repository de Subject
- [ ] Service de Subject
- [ ] Router de Subject (CRUD completo)
- [ ] Relación User → Subjects

## 🔲 Backend — Documentos

- [ ] Modelo `Document` — título, filename, storage_path, subject_id
- [ ] Migración de la tabla documents
- [ ] Configurar Supabase Storage para PDFs
- [ ] Endpoint de subida de PDF
- [ ] Extracción de texto del PDF (PyMuPDF)
- [ ] Repository y Service de Document
- [ ] Router de Document

## 🔲 Backend — Chat con IA

- [ ] Modelo `Conversation` y `Message`
- [ ] Migraciones de las tablas
- [ ] Integración con Gemini SDK
- [ ] Endpoint de chat con contexto del PDF
- [ ] Streaming de respuestas
- [ ] Historial de conversaciones por materia

## 🔲 Frontend — Materias

- [ ] Feature `/features/subjects`
- [ ] Listado de materias en el dashboard
- [ ] Crear materia (modal o página)
- [ ] Editar y eliminar materia
- [ ] Página de materia individual

## 🔲 Frontend — Documentos

- [ ] Feature `/features/documents`
- [ ] Upload de PDFs por materia
- [ ] Listado de documentos por materia
- [ ] Eliminar documento

## 🔲 Frontend — Chat

- [ ] Feature `/features/chat`
- [ ] Interfaz de chat por materia
- [ ] Streaming de respuestas en tiempo real
- [ ] Historial de conversaciones

## 🔲 UX & Estilos

- [ ] Tailwind CSS configurado
- [ ] Layout general con sidebar
- [ ] Diseño del dashboard
- [ ] Diseño de la página de materia
- [ ] Diseño del chat
- [ ] Loading states y error states
- [ ] Responsive

## 🔲 Futuro (post-MVP)

- [ ] RAG con embeddings y pgvector
- [ ] Generador de preguntas de examen
- [ ] Resumen automático al subir PDF
- [ ] Modo oscuro
- [ ] Planes de pago (Freemium)
