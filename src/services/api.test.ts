import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import {
  ApiError,
  fetchDistances,
  fetchVacancies,
  geocodeAddress,
} from "@/services/api"

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock as unknown as typeof fetch
})

afterEach(() => {
  fetchMock.mockReset()
})

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "Content-Type": "application/json" },
  })
}

describe("api client", () => {
  test("fetchVacancies serializa params multi-valor como repeated keys", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))
    await fetchVacancies({
      lat: 37.388,
      lon: -5.995,
      radius_km: 20,
      cuerpo: ["590", "597"],
      provincia: ["Sevilla"],
      limit: 100,
    })
    const url = new URL((fetchMock.mock.calls[0][0] as URL | string).toString())
    expect(url.pathname).toBe("/vacancies")
    expect(url.searchParams.get("lat")).toBe("37.388")
    expect(url.searchParams.get("lon")).toBe("-5.995")
    expect(url.searchParams.get("radius_km")).toBe("20")
    expect(url.searchParams.getAll("cuerpo")).toEqual(["590", "597"])
    expect(url.searchParams.getAll("provincia")).toEqual(["Sevilla"])
    expect(url.searchParams.get("limit")).toBe("100")
  })

  test("fetchVacancies omite params undefined/null", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))
    await fetchVacancies({})
    const url = new URL((fetchMock.mock.calls[0][0] as URL | string).toString())
    expect(url.search).toBe("")
  })

  test("geocodeAddress hace POST con body JSON", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        lat: 37.388,
        lon: -5.995,
        address_norm: "sevilla",
        cached: false,
      })
    )
    const out = await geocodeAddress("Sevilla")
    expect(out.lat).toBe(37.388)
    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.method).toBe("POST")
    expect(JSON.parse(init.body as string)).toEqual({ address: "Sevilla" })
  })

  test("fetchDistances envía origin + destinations en body", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ results: [] }))
    await fetchDistances(
      { lat: 37, lon: -5 },
      [{ id: 1, lat: 36, lon: -4 }]
    )
    const init = fetchMock.mock.calls[0][1] as RequestInit
    const body = JSON.parse(init.body as string)
    expect(body.origin).toEqual({ lat: 37, lon: -5 })
    expect(body.destinations).toEqual([{ id: 1, lat: 36, lon: -4 }])
  })

  test("error 4xx lanza ApiError con detail", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ detail: "address_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    )
    const err = await geocodeAddress("xxx").catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(404)
    expect(err.message).toBe("address_not_found")
  })
})
