# Risk Control – Monorepo

Proyecto unificado con frontend (Next.js) y backend (Laravel) para monitoreo de reglas de riesgo, incidentes y cuentas.

## Estructura
- `frontend/` — UI en Next.js (App Router), Tailwind, React Query.
- `risk-control-backend/` — API en Laravel (gestiona cuentas, reglas, incidentes, trades, acciones).
- `docker-compose.yml` — (si lo usas) orquesta servicios; ajusta según tu entorno.

## Requisitos
- Node.js 18+ y npm (para frontend)
- PHP 8.1+ y Composer (para backend)
- Base de datos (MySQL/PostgreSQL) configurada en el `.env` del backend

## Puesta en marcha rápida

### Backend (Laravel)
```bash
cd risk-control-backend
cp .env.example .env
# edita DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD

composer install
php artisan key:generate
php artisan migrate --seed   # datos de ejemplo
php artisan serve            # http://localhost:8000
```

### Frontend (Next.js)
```bash
cd frontend
cp .env.local.example .env.local  # si lo usas; si no, crea uno y pon NEXT_PUBLIC_API_URL
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

npm install
npm run dev          # http://localhost:3000

# build prod
npm run build
npm run start
```

## Notas de integración
- El frontend consume `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:8000/api/v1`).
- Ajusta CORS en el backend si sirves frontend en otro dominio/puerto.
- Para colas en Laravel, configura el driver en `.env` y ejecuta `php artisan queue:work`.

## Documentación específica
- `frontend/README.md` para detalle de UI, scripts y arquitectura del cliente.
- `risk-control-backend/README.md` para detalle de API, endpoints y setup del servidor.


