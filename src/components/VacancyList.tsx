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

function VacancyCardSkeleton() {
  return (
    <div className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
      <div className="flex items-start gap-2">
        <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2.5 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
      </div>
    </div>
  )
}

export function VacancyList() {
  const { data, isLoading, isError, refetch, isFetching } = useVacancies()
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
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <VacancyCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
        <p className="font-medium">No se pudieron cargar las vacantes.</p>
        <p className="text-rose-600/80">Comprueba que el backend está arrancado.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {isFetching ? "Reintentando…" : "Reintentar"}
        </button>
      </div>
    )
  }

  if (!visible.length) {
    const total = data?.length ?? 0
    return (
      <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        {total === 0 ? (
          <p>No hay vacantes con estos criterios. Prueba a ampliar el radio o quitar filtros.</p>
        ) : (
          <p>
            No hay vacantes en el área visible del mapa. Mueve o aleja el mapa
            ({total} totales con los filtros actuales).
          </p>
        )}
      </div>
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
