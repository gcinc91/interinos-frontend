import { beforeEach, describe, expect, test } from "vitest"

import { useUIStore } from "@/store/uiStore"

const EMPTY = {
  cuerpos: [],
  especialidades: [],
  provincias: [],
  tipos: [],
  participaciones: [],
}

beforeEach(() => {
  useUIStore.setState({
    origin: null,
    radiusKm: 30,
    filters: EMPTY,
    hoveredId: null,
    selectedId: null,
    mapBounds: null,
    theme: "system",
    sidebarOpen: false,
  })
})

describe("uiStore", () => {
  test("setOrigin guarda lat/lon/address", () => {
    useUIStore.getState().setOrigin({ address: "Sevilla", lat: 37.4, lon: -5.99 })
    expect(useUIStore.getState().origin).toEqual({
      address: "Sevilla",
      lat: 37.4,
      lon: -5.99,
    })
  })

  test("setFilter actualiza solo la categoría afectada", () => {
    useUIStore.getState().setFilter("cuerpos", ["590"])
    useUIStore.getState().setFilter("provincias", ["Sevilla"])
    const { filters } = useUIStore.getState()
    expect(filters.cuerpos).toEqual(["590"])
    expect(filters.provincias).toEqual(["Sevilla"])
    expect(filters.especialidades).toEqual([])
  })

  test("resetFilters limpia todo", () => {
    useUIStore.getState().setFilter("cuerpos", ["590", "597"])
    useUIStore.getState().setFilter("tipos", ["Sustitución"])
    useUIStore.getState().resetFilters()
    expect(useUIStore.getState().filters).toEqual(EMPTY)
  })

  test("setRadiusKm permite cambios numéricos", () => {
    useUIStore.getState().setRadiusKm(50)
    expect(useUIStore.getState().radiusKm).toBe(50)
  })

  test("setSelectedId / setHoveredId no se interfieren", () => {
    useUIStore.getState().setHoveredId(42)
    useUIStore.getState().setSelectedId(7)
    const s = useUIStore.getState()
    expect(s.hoveredId).toBe(42)
    expect(s.selectedId).toBe(7)
  })
})
