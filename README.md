# interinos-frontend

Web app en React/Vite para la app **Interinos** — mapa de vacantes docentes de la Junta de Andalucía (SIPRI) para profesores interinos.

Mapa Leaflet centrado en la dirección del usuario, lista sincronizada por viewport, filtros multi-valor por cuerpo/provincia/etc, distancia por carretera bajo demanda, detección automática de actualizaciones del backend.

**Live**: https://interinos-frontend.vercel.app

## Stack

- Vite 8 + React 19 + TypeScript 6
- Tailwind CSS 4 + Inter Variable
- Leaflet + react-leaflet 5 + react-leaflet-cluster
- Zustand 5 (store + persist localStorage)
- @tanstack/react-query 5
- lucide-react (iconos)

## Setup local

Requiere Node 20+ (probado con 22).

```bash
npm install
cp .env.example .env       # opcional, default ya apunta a localhost:8000
npm run dev
```

App en `http://localhost:5173` contra backend en `http://localhost:8000`.

### Tests / lint / typecheck

```bash
npm run test         # vitest, 12 tests (api client, store, hooks)
npm run typecheck    # tsc -b --noEmit
npm run lint         # eslint
npm run build        # producción
```

## Variables de entorno

| Variable | Descripción | Por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend FastAPI | http://localhost:8000 |

## Estructura

```
src/
├── App.tsx                # layout shell
├── main.tsx               # raíz + QueryClientProvider
├── index.css              # Tailwind + Inter + custom dark variant
├── components/            # Map, Sidebar, Filters, AddressInput, RadiusSlider,
│                          # VacancyCard/List/Detail, UpdateToast, ThemeToggle
├── hooks/                 # useVacancies, useGeocode, useDistance,
│                          # useVacanciesVersion, useFilters, useUrlState, useTheme
├── services/api.ts        # cliente fetch tipado
├── store/uiStore.ts       # zustand + persist (origen, radio, filtros, theme)
├── types/api.ts           # tipos compartidos con backend
└── lib/                   # leaflet-icons, queryClient
```

## URL state

La app sincroniza store ⇄ `?addr&lat&lon&r&c[]&pr[]&ti[]&pa[]&e[]&id` vía `history.replaceState`. URLs compartibles:

```
https://interinos-frontend.vercel.app/?addr=Sevilla&lat=37.388&lon=-5.995&r=15&c=590&pr=Sevilla
```

## Deploy (producción)

### Vercel

1. Importa este repo en Vercel → detecta `vercel.json` (framework Vite, rewrites SPA, cache immutable assets).
2. Env var `VITE_API_URL` apuntando al backend Render.
3. Push a `main` → deploy automático.

CORS desde Vercel → Render: el backend permite `^https://.*\.vercel\.app$` por regex (cubre previews).

## Troubleshooting

- **Marcadores Leaflet sin imagen**: ya manejado en `lib/leaflet-icons.ts` (registra `L.Icon.Default` URLs vite-friendly).
- **Cold start backend en primera carga**: Render free duerme tras 15 min idle. Primera petición tras dormir ~30-60s. La lista mostrará skeleton hasta que llegue.

## Backend

[interinos-backend](https://github.com/gcinc91/interinos-backend) — FastAPI + PostGIS + GitHub Actions cron.

## Licencia

Apache 2.0 — ver [LICENSE](LICENSE).
