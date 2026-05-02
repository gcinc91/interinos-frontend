import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { LatLngBoundsLiteral } from "leaflet"

export interface Origin {
  address: string
  lat: number
  lon: number
}

export interface Filters {
  cuerpos: string[]
  especialidades: string[]
  provincias: string[]
  tipos: string[]
  participaciones: string[]
}

export type ThemePreference = "system" | "light" | "dark"

export interface UIState {
  origin: Origin | null
  radiusKm: number
  filters: Filters
  hoveredId: number | null
  selectedId: number | null
  mapBounds: { minLon: number; minLat: number; maxLon: number; maxLat: number } | null
  theme: ThemePreference

  setOrigin: (origin: Origin | null) => void
  setRadiusKm: (radius: number) => void
  setFilter: <K extends keyof Filters>(key: K, values: Filters[K]) => void
  resetFilters: () => void
  setHoveredId: (id: number | null) => void
  setSelectedId: (id: number | null) => void
  setMapBounds: (bounds: UIState["mapBounds"]) => void
  setTheme: (theme: ThemePreference) => void
}

const EMPTY_FILTERS: Filters = {
  cuerpos: [],
  especialidades: [],
  provincias: [],
  tipos: [],
  participaciones: [],
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      origin: null,
      radiusKm: 30,
      filters: EMPTY_FILTERS,
      hoveredId: null,
      selectedId: null,
      mapBounds: null,
      theme: "system",
      setOrigin: (origin) => set({ origin }),
      setRadiusKm: (radius) => set({ radiusKm: radius }),
      setFilter: (key, values) =>
        set((state) => ({ filters: { ...state.filters, [key]: values } })),
      resetFilters: () => set({ filters: EMPTY_FILTERS }),
      setHoveredId: (id) => set({ hoveredId: id }),
      setSelectedId: (id) => set({ selectedId: id }),
      setMapBounds: (bounds) => set({ mapBounds: bounds }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "interinos-ui",
      partialize: (state) => ({
        origin: state.origin,
        radiusKm: state.radiusKm,
        filters: state.filters,
        theme: state.theme,
      }),
    }
  )
)

// Helper: Andalucía bbox (centro aprox: Sevilla)
export const ANDALUSIA_CENTER: { lat: number; lon: number } = { lat: 37.5, lon: -4.7 }
export const ANDALUSIA_BOUNDS: LatLngBoundsLiteral = [
  [35.9, -7.6],
  [38.8, -1.5],
]
