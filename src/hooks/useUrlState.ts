import { useEffect, useRef } from "react"

import { type Filters, useUIStore } from "@/store/uiStore"

const KEY_TO_FILTER: Record<string, keyof Filters> = {
  c: "cuerpos",
  e: "especialidades",
  pr: "provincias",
  ti: "tipos",
  pa: "participaciones",
}

const FILTER_TO_KEY: Record<keyof Filters, string> = Object.fromEntries(
  Object.entries(KEY_TO_FILTER).map(([k, v]) => [v, k])
) as Record<keyof Filters, string>

/**
 * Hidrata el store desde `window.location.search` al mount y sincroniza
 * cambios posteriores via `history.replaceState` (sin polluir history).
 * Sólo persiste origen, radio, filtros y selectedId — `mapBounds` es
 * efímero (lo dicta el viewport).
 */
export function useUrlState() {
  const origin = useUIStore((s) => s.origin)
  const radiusKm = useUIStore((s) => s.radiusKm)
  const filters = useUIStore((s) => s.filters)
  const selectedId = useUIStore((s) => s.selectedId)

  const setOrigin = useUIStore((s) => s.setOrigin)
  const setRadiusKm = useUIStore((s) => s.setRadiusKm)
  const setFilter = useUIStore((s) => s.setFilter)
  const setSelectedId = useUIStore((s) => s.setSelectedId)

  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const params = new URLSearchParams(window.location.search)

    const lat = params.get("lat")
    const lon = params.get("lon")
    const addr = params.get("addr")
    if (lat && lon) {
      setOrigin({
        address: addr ?? "",
        lat: Number(lat),
        lon: Number(lon),
      })
    }

    const radius = params.get("r")
    if (radius) {
      const n = Number(radius)
      if (Number.isFinite(n) && n > 0) setRadiusKm(n)
    }

    for (const [key, filterKey] of Object.entries(KEY_TO_FILTER)) {
      const values = params.getAll(key)
      if (values.length > 0) setFilter(filterKey, values)
    }

    const id = params.get("id")
    if (id) {
      const n = Number(id)
      if (Number.isFinite(n)) setSelectedId(n)
    }
  }, [setOrigin, setRadiusKm, setFilter, setSelectedId])

  useEffect(() => {
    if (!hydrated.current) return
    const params = new URLSearchParams()

    if (origin) {
      if (origin.address) params.set("addr", origin.address)
      params.set("lat", origin.lat.toFixed(5))
      params.set("lon", origin.lon.toFixed(5))
    }
    if (radiusKm !== 30) params.set("r", String(radiusKm))

    for (const [filterKey, urlKey] of Object.entries(FILTER_TO_KEY) as [
      keyof Filters,
      string,
    ][]) {
      for (const v of filters[filterKey]) params.append(urlKey, v)
    }

    if (selectedId !== null) params.set("id", String(selectedId))

    const search = params.toString()
    const url = `${window.location.pathname}${search ? "?" + search : ""}`
    if (url !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", url)
    }
  }, [origin, radiusKm, filters, selectedId])
}
