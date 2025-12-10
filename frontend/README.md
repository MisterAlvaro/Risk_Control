# Risk Control – Frontend (Next.js)

Panel web para monitorear reglas de riesgo, incidentes y cuentas. Construido con Next.js (App Router), Tailwind y React Query, consumiendo la API expuesta por el backend.

## Requisitos
- Node.js 18+
- npm

## Variables de entorno
Crear `frontend/.env.local` si necesitas sobrescribir la URL de la API:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Levantar entorno local
```bash
cd frontend
npm install
npm run dev          # http://localhost:3000

# Build y start en producción
npm run build
npm run start
```

## Arquitectura breve
- **Next.js App Router**: páginas en `app/` (`page.tsx`, `layout.tsx`, secciones `accounts`, `incidents`, `rules`, `trades`).
- **Datos**: `lib/api` (axios client + endpoints + tipos), React Query para caché/fetch por página.
- **UI**: componentes en `components/ui` (botón, select, tabs, cards, tablas, badges, switch); estilos y tokens en `app/globals.css` (paleta primario #e1bb80 / secundario #352208).
- **Servicios/Helpers**: `services/*` y `lib/utils/*` (formatters, constants, validators).
- **Estado y providers**: `components/providers/query-provider` inyecta React Query.
- **Diseño**: dashboard con widgets de métricas, listas compactas y tabla de cuentas de riesgo; layouts adaptables con Tailwind.*** End Patch
