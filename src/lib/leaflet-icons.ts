// Leaflet icons no se resuelven con bundlers por defecto. Importamos los
// assets explícitamente y los registramos en `L.Icon.Default`.
import L from "leaflet"
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import iconUrl from "leaflet/dist/images/marker-icon.png"
import shadowUrl from "leaflet/dist/images/marker-shadow.png"

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
})

// Color por cuerpo (Tailwind 500). Mantener sincronizado con backend KNOWN_CUERPOS.
const CUERPO_COLOR: Record<string, string> = {
  "590": "#10b981", // emerald  - PES
  "591": "#0ea5e9", // sky      - PSEFP
  "592": "#f43f5e", // rose     - EOI
  "593": "#a855f7", // purple   - Cátedras Música
  "594": "#8b5cf6", // violet   - Música/Artes
  "595": "#ec4899", // pink     - Artes Plásticas
  "596": "#ef4444", // red      - Maestros Taller
  "597": "#0284c7", // sky-600  - Maestros
  "598": "#f59e0b", // amber    - FP Especialistas
  OTROS: "#71717a", // zinc
}

export function colorForCuerpo(cuerpo: string | null | undefined): string {
  if (!cuerpo) return CUERPO_COLOR.OTROS
  return CUERPO_COLOR[cuerpo] ?? CUERPO_COLOR.OTROS
}

export const originIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="31" viewBox="0 0 44 48" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,0.35))">
    <!-- Chimenea -->
    <rect x="29" y="5" width="5" height="10" rx="1" fill="#fef3c7" stroke="#92400e" stroke-width="1.5"/>
    <!-- Tejado -->
    <polygon points="22,2 2,20 42,20" fill="#fbbf24" stroke="#92400e" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Franja sombra tejado -->
    <polygon points="22,2 2,20 8,20 22,8 36,20 42,20" fill="#f59e0b" opacity="0.4"/>
    <!-- Cuerpo -->
    <rect x="5" y="19" width="34" height="27" rx="2" fill="#fef9e7" stroke="#92400e" stroke-width="1.5"/>
    <!-- Ventana izquierda -->
    <rect x="9" y="24" width="10" height="9" rx="1.5" fill="#bfdbfe" stroke="#92400e" stroke-width="1"/>
    <line x1="14" y1="24" x2="14" y2="33" stroke="#92400e" stroke-width="0.8"/>
    <line x1="9" y1="28.5" x2="19" y2="28.5" stroke="#92400e" stroke-width="0.8"/>
    <!-- Puerta -->
    <rect x="25" y="28" width="11" height="18" rx="1.5" fill="#d97706" stroke="#92400e" stroke-width="1"/>
    <!-- Arco puerta -->
    <path d="M25,31 a5.5,5.5 0 0,1 11,0" fill="#c2600a" stroke="none"/>
    <!-- Pomo -->
    <circle cx="28.5" cy="37" r="1.2" fill="#92400e"/>
  </svg>`,
  iconSize: [28, 31],
  iconAnchor: [14, 31],
})

export function makeVacancyIcon(cuerpo: string, highlighted = false): L.DivIcon {
  const color = colorForCuerpo(cuerpo)
  const size = highlighted ? 28 : 22
  const ring = highlighted ? "ring-2 ring-zinc-900" : ""
  return L.divIcon({
    className: "vacancy-marker",
    html: `<span class="block rounded-full border-2 border-white shadow ${ring}" style="width:${size}px;height:${size}px;background:${color};"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}
