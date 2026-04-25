# Kollect

Sistema de gestión de procesos judiciales para flujos de cobro jurídico en Colombia. Permite crear, consultar y actualizar expedientes a lo largo de las etapas del proceso (demanda → sentencia → remate → archivo).

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Base de datos | SQLite (better-sqlite3, modo WAL) |
| Formularios | React Hook Form + Zod |
| UI | Radix UI + Lucide icons |
| Data fetching | TanStack Query |

## Estructura del repositorio

```
Kollect/
├── client/          # Frontend React (Vite)
├── server/          # API Express
├── shared/          # Tipos compartidos
├── context/         # Documentación del flujo operativo judicial
└── kollect.db       # Base de datos SQLite
```

## Requisitos

- Node.js 18+
- npm 9+

## Instalación y desarrollo

```bash
# Instalar dependencias en todos los paquetes
npm install
npm install --prefix client
npm install --prefix server

# Iniciar servidor de desarrollo (frontend + backend en paralelo)
npm run dev
```

El servidor API corre en `http://localhost:3001` y el frontend en `http://localhost:5173`.

## Producción

```bash
# Compilar el frontend
npm run build

# Iniciar servidor (sirve la app estática + API)
npm start
```

## Variables de entorno

El servidor usa valores por defecto si no existe un archivo `.env` en `server/`:

| Variable | Defecto | Descripción |
|----------|---------|-------------|
| `PORT` | `3001` | Puerto del servidor Express |
| `DB_PATH` | `./kollect.db` | Ruta al archivo SQLite |

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cases` | Listar expedientes (paginado, búsqueda por texto) |
| GET | `/api/cases/:id` | Obtener expediente por ID |
| POST | `/api/cases` | Crear expediente |
| PUT | `/api/cases/:id` | Actualizar expediente |

Parámetros de consulta para listado: `page`, `pageSize`, `q` (búsqueda de texto libre).

## Funcionalidades principales

- **Formulario de 12 pestañas** que cubre el ciclo judicial completo: identificación, radicación, bienes, embargo, notificación, audiencias, liquidación, remate y seguimiento.
- **Auto-guardado de borrador** en `localStorage` con debounce de 5 segundos.
- **Campos de solo lectura gestionados automáticamente** (Tab 12): snapshots de etapa y observaciones actualizados por trigger en la base de datos.
- **Búsqueda y paginación** de expedientes por nombre de deudor, número de caso o identificación.
- **Formato de moneda COP** en todos los campos financieros.
- **Validación completa** con Zod en cliente y servidor.
