# interinos-frontend

Web app en React/Vite para la app **Interinos** — mapa de vacantes docentes de la Junta de Andalucía (SIPRI) para profesores interinos.

Mapa Leaflet centrado en la dirección del usuario, lista sincronizada ordenada por distancia, filtros por cuerpo/especialidad/provincia, distancia por carretera bajo demanda, detección de actualizaciones de la fuente.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Leaflet + react-leaflet + react-leaflet-markercluster
- Zustand (state) + URL querystring
- React Query / SWR para data fetching

## Setup local

Requiere Node 20+ (probado con 25.x).

```bash
npm install
cp .env.example .env  # rellenar VITE_API_URL
npm run dev
```

App en `http://localhost:5173`.

## Backend

[interinos-backend](https://github.com/gcinc91/interinos-backend) — FastAPI + PostGIS.

## Licencia

Apache 2.0 — ver [LICENSE](LICENSE).
