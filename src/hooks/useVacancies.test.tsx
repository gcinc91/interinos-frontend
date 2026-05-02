import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"

import { useVacancies } from "@/hooks/useVacancies"
import { useUIStore } from "@/store/uiStore"

const fetchMock = vi.fn()

const EMPTY = {
  cuerpos: [],
  especialidades: [],
  provincias: [],
  tipos: [],
  participaciones: [],
}

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
}

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock as unknown as typeof fetch
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

afterEach(() => {
  fetchMock.mockReset()
})

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

describe("useVacancies", () => {
  test("sin origen, llama /vacancies sin lat/lon/radius_km", async () => {
    fetchMock.mockResolvedValue(jsonResponse([]))
    const { result } = renderHook(() => useVacancies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const url = new URL((fetchMock.mock.calls[0][0] as URL).toString())
    expect(url.pathname).toBe("/vacancies")
    expect(url.searchParams.get("lat")).toBeNull()
    expect(url.searchParams.get("lon")).toBeNull()
    expect(url.searchParams.get("radius_km")).toBeNull()
    expect(url.searchParams.get("limit")).toBe("1000")
  })

  test("con origen + filtros, propaga al backend", async () => {
    useUIStore.setState({
      origin: { address: "Sevilla", lat: 37.4, lon: -5.99 },
      radiusKm: 25,
      filters: { ...EMPTY, cuerpos: ["590"], provincias: ["Sevilla"] },
    })
    fetchMock.mockResolvedValue(jsonResponse([]))
    const { result } = renderHook(() => useVacancies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const url = new URL((fetchMock.mock.calls[0][0] as URL).toString())
    expect(url.searchParams.get("lat")).toBe("37.4")
    expect(url.searchParams.get("lon")).toBe("-5.99")
    expect(url.searchParams.get("radius_km")).toBe("25")
    expect(url.searchParams.getAll("cuerpo")).toEqual(["590"])
    expect(url.searchParams.getAll("provincia")).toEqual(["Sevilla"])
  })
})
