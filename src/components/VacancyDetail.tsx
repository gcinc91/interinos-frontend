import { useEffect } from "react"

import { useDistance } from "@/hooks/useDistance"
import { useVacancyDetail } from "@/hooks/useVacancyDetail"
import { colorForCuerpo } from "@/lib/leaflet-icons"
import { useUIStore } from "@/store/uiStore"

const SIPRI_URL = "https://sipri.juntadeandalucia.es/sipri/plazas/plaza"

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("es-ES")
  } catch {
    return iso
  }
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—"
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}min` : `${m}min`
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-100">{value ?? "—"}</dd>
    </div>
  )
}

export function VacancyDetail() {
  const selectedId = useUIStore((s) => s.selectedId)
  const setSelectedId = useUIStore((s) => s.setSelectedId)
  const origin = useUIStore((s) => s.origin)
  const { data: vacancy, isLoading, isError } = useVacancyDetail(selectedId)
  const distance = useDistance()

  useEffect(() => {
    distance.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null)
    }
    if (selectedId !== null) document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [selectedId, setSelectedId])

  if (selectedId === null) return null

  const close = () => setSelectedId(null)

  return (
    <div
      role="dialog"
      aria-modal
      onClick={close}
      className="fixed inset-0 z-50 grid place-items-end bg-zinc-900/40 backdrop-blur-sm sm:place-items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-lg bg-white shadow-xl dark:bg-zinc-900 sm:rounded-lg"
      >
        <header className="flex items-start justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <div className="flex items-baseline gap-2">
            {vacancy && (
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: colorForCuerpo(vacancy.cuerpo) }}
              />
            )}
            <h2 className="text-base font-semibold">
              {vacancy?.centro ?? (isLoading ? "Cargando…" : "Vacante")}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isError && <p className="text-sm text-rose-600">Error al cargar el detalle.</p>}
          {vacancy && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Cuerpo" value={vacancy.cuerpo} />
              <Field label="Especialidad" value={vacancy.especialidad} />
              <Field label="Cód. centro" value={vacancy.centro_codigo} />
              <Field label="Cód. puesto" value={vacancy.puesto_codigo} />
              <Field label="Localidad" value={vacancy.localidad} />
              <Field label="Provincia" value={vacancy.provincia} />
              <Field label="Tipo" value={vacancy.tipo} />
              <Field label="Participación" value={vacancy.participacion} />
              <Field label="Fecha cese" value={formatDate(vacancy.fecha_cese)} />
              <Field
                label="Distancia recta"
                value={
                  vacancy.straight_distance_km !== null
                    ? `${vacancy.straight_distance_km.toFixed(1)} km`
                    : null
                }
              />
              {vacancy.observaciones && (
                <div className="col-span-2">
                  <dt className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Observaciones
                  </dt>
                  <dd className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
                    {vacancy.observaciones}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {vacancy && origin && (
            <div className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Distancia por carretera
                </span>
                {!distance.data && (
                  <button
                    type="button"
                    disabled={distance.isPending}
                    onClick={() =>
                      distance.mutate({
                        origin: { lat: origin.lat, lon: origin.lon },
                        destination: { id: vacancy.id, lat: vacancy.lat, lon: vacancy.lon },
                      })
                    }
                    className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {distance.isPending ? "Calculando…" : "Calcular"}
                  </button>
                )}
              </div>
              {distance.data && distance.data.results[0] && (
                <DistanceLine
                  result={distance.data.results[0]}
                />
              )}
            </div>
          )}

          {vacancy && !origin && (
            <p className="mt-5 text-xs text-zinc-500">
              Introduce tu dirección para calcular la distancia por carretera.
            </p>
          )}
        </div>

        <footer className="flex justify-between border-t border-zinc-200 px-5 py-3 text-xs dark:border-zinc-800">
          <a
            href={SIPRI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Ver en SIPRI ↗
          </a>
          <span className="text-zinc-400">id #{vacancy?.id ?? "…"}</span>
        </footer>
      </div>
    </div>
  )
}

function DistanceLine({
  result,
}: {
  result: {
    road_distance_m: number | null
    road_duration_s: number | null
    source: string
    straight_distance_km: number
  }
}) {
  if (result.road_distance_m === null) {
    return (
      <p className="mt-2 text-xs text-zinc-500">
        OSRM no disponible — distancia recta {result.straight_distance_km.toFixed(1)} km.
      </p>
    )
  }
  return (
    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
      <div>
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">Carretera</p>
        <p className="font-medium">{(result.road_distance_m / 1000).toFixed(1)} km</p>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">Tiempo</p>
        <p className="font-medium">{formatDuration(result.road_duration_s)}</p>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">Fuente</p>
        <p className="font-medium capitalize">{result.source}</p>
      </div>
    </div>
  )
}
