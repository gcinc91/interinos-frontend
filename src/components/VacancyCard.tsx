import { colorForCuerpo } from "@/lib/leaflet-icons"
import type { VacancySummary } from "@/types/api"

interface Props {
  vacancy: VacancySummary
  isHovered: boolean
  isSelected: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}

export function VacancyCard({
  vacancy,
  isHovered,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: Props) {
  const color = colorForCuerpo(vacancy.cuerpo)
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`cursor-pointer rounded-md border px-3 py-2 transition ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
          : isHovered
            ? "border-zinc-400 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800/50"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
          style={{ background: color }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {vacancy.centro}
          </p>
          <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
            {vacancy.especialidad ?? vacancy.cuerpo}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500">
            <span>{vacancy.localidad ?? "—"}</span>
            <span aria-hidden>·</span>
            <span>{vacancy.provincia}</span>
            {vacancy.straight_distance_km !== null && (
              <>
                <span aria-hidden>·</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {vacancy.straight_distance_km < 1
                    ? `${(vacancy.straight_distance_km * 1000).toFixed(0)} m`
                    : `${vacancy.straight_distance_km.toFixed(1)} km`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
