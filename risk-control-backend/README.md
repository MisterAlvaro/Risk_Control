# Risk Control – Backend (Laravel)

API para gestionar cuentas, reglas de riesgo, incidentes, acciones y trades.

## Requisitos
- PHP 8.1+
- Composer
- Base de datos (MySQL/PostgreSQL) configurada en `.env`
- Opcional: Redis/driver de colas si ejecutas jobs

## Configuración rápida
```bash
cd risk-control-backend
cp .env.example .env
# Edita .env: DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD

composer install
php artisan key:generate
php artisan migrate --seed   # crea y llena datos de ejemplo

# Servir en http://localhost:8000
php artisan serve
```

## Arquitectura breve
- **app/Domain**: Modelos y enums (Account, Incident, RiskRule, RiskAction, Trade).
- **app/Application**: Servicios de aplicación, DTOs, interfaces.
- **app/Rules**: Reglas de riesgo (base + implementaciones + fábrica).
- **app/Http**: Controllers, Requests, Resources. Rutas en `routes/api.php`.
- **Infrastructure**: Jobs/Listeners para procesos async.
- **Database**: Migraciones, factories y seeders (`database/`).
- **Config**: Ajustes de app, DB, cache, mail, queue.

## Endpoints clave (referencia)
- `GET /api/v1/accounts`, `GET /api/v1/accounts/{id}`, `GET /api/v1/accounts/{id}/risk-status`
- `GET /api/v1/incidents` (filtros: status, rango de fechas), `POST /api/v1/incidents/{id}/resolve`
- `GET /api/v1/risk-rules` (+ acciones asociadas)
- `GET /api/v1/actions`, `GET /api/v1/trades`

## Scripts útiles
- `php artisan migrate --seed`  prepara la BD
- `php artisan serve`  servidor local
- `php artisan test`   pruebas
- `php artisan queue:work` si habilitas colas

## Notas
- Ajusta CORS y URLs de frontend/backend en `.env` si despliegas por separado.
- Si usas Docker, puedes crear tu propio `docker-compose` (no incluido aquí) o apuntar a la BD local.*** End Patch
