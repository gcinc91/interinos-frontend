// Cliente API tipado para interinos-backend. Usa `VITE_API_URL` (default localhost:8000).

import type {
  DistanceDestination,
  DistanceResponse,
  FiltersResponse,
  GeocodeResponse,
  VacanciesQuery,
  VacanciesVersionResponse,
  VacancyDetail,
  VacancySummary,
} from "@/types/api"

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(
  /\/+$/,
  ""
)

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { params?: Record<string, unknown> } = {}
): Promise<T> {
  const { params, ...rest } = init
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined && v !== null) url.searchParams.append(key, String(v))
        }
      } else {
        url.searchParams.set(key, String(value))
      }
    }
  }
  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
  })
  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = await response.json()
      if (typeof body?.detail === "string") detail = body.detail
    } catch {
      /* ignore body parse errors */
    }
    throw new ApiError(response.status, detail)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export async function fetchHealth(): Promise<{ status: string }> {
  return request("/health")
}

export async function fetchVacanciesVersion(): Promise<VacanciesVersionResponse> {
  return request("/vacancies/version")
}

export async function fetchVacancies(
  query: VacanciesQuery = {}
): Promise<VacancySummary[]> {
  return request("/vacancies", { params: query as Record<string, unknown> })
}

export async function fetchVacancy(id: number): Promise<VacancyDetail> {
  return request(`/vacancies/${id}`)
}

export async function fetchFilters(): Promise<FiltersResponse> {
  return request("/filters")
}

export async function geocodeAddress(address: string): Promise<GeocodeResponse> {
  return request("/geocode", {
    method: "POST",
    body: JSON.stringify({ address }),
  })
}

export async function fetchDistances(
  origin: { lat: number; lon: number },
  destinations: DistanceDestination[]
): Promise<DistanceResponse> {
  return request("/distance", {
    method: "POST",
    body: JSON.stringify({ origin, destinations }),
  })
}

export { ApiError, BASE_URL }
