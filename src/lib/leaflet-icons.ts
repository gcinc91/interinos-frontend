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
