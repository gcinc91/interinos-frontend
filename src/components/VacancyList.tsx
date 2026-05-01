import { useMemo } from "react"

import { VacancyCard } from "@/components/VacancyCard"
import { useVacancies } from "@/hooks/useVacancies"
import { useUIStore } from "@/store/uiStore"
import type { VacancySummary } from "@/types/api"

function inBounds(
  vacancy: VacancySummary,
  bounds: { minLon: number; minLat: number; maxLon: number; maxLat: number } | null
) {
  if (!bounds) return true
  return (
    vacancy.lon >= bounds.minLon &&
    vacancy.lon <= bounds.maxLon &&
    vacancy.lat >= bounds.minLat &&
    vacancy.lat <= bounds.maxLat
  )
}

export function VacancyList() {
  const { data, isLoading, isError } = useVacancies()
  const mapBounds = useUIStore((s) => s.mapBounds)
  const hoveredId = useUIStore((s) => s.hoveredId)
  const selectedId = useUIStore((s) => s.selectedId)
  const setHoveredId = useUIStore((s) => s.setHoveredId)
  const setSelectedId = useUIStore((s) => s.setSelectedId)

  const visible = useMemo(
    () => (data ?? []).filter((v) => inBounds(v, mapBounds)),
    [data, mapBounds]
  )

  if (isLoading) {
    return (
      <p className="px-1 text-xs text-zinc-500">Cargando vacantes…</p>
    )
  }
  if (isError) {
    return (
      <p className="px-1 text-xs text-rose-600">
        Error al cargar vacantes. ¿Backend arrancado?
      </p>
    )
  }
  if (!visible.length) {
    return (
      <p className="px-1 text-xs text-zinc-500">
        No hay vacantes en este área. Prueba a ampliar el radio o mover el mapa.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {visible.map((vacancy) => (
        <li key={vacancy.id}>
          <VacancyCard
            vacancy={vacancy}
            isHovered={hoveredId === vacancy.id}
            isSelected={selectedId === vacancy.id}
            onMouseEnter={() => setHoveredId(vacancy.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedId(vacancy.id)}
          />
        </li>
      ))}
    </ul>
  )
}
