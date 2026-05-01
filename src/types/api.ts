// Tipos compartidos con el backend (interinos-backend).

export type DistanceSource = "osrm" | "cache" | "haversine"

export interface VacancySummary {
  id: number
  source_id: string
  cuerpo: string
  especialidad: string | null
  centro: string
  localidad: string | null
  provincia: string | null
  tipo: string | null
  participacion: string | null
  fecha_cese: string | null
  lat: number
  lon: number
  straight_distance_km: number | null
}

export interface VacancyDetail extends VacancySummary {
  centro_codigo: string | null
  puesto_codigo: string | null
  observaciones: string | null
  raw_payload: Record<string, unknown>
  is_active: boolean
  updated_at: string
}

export interface FiltersResponse {
  cuerpos: string[]
  especialidades: string[]
  provincias: string[]
  tipos: string[]
  participaciones: string[]
}

export interface VacanciesVersionResponse {
  data_version: string | null
  last_run_at: string | null
  items_active: number
}

export interface GeocodeResponse {
  lat: number
  lon: number
  address_norm: string
  cached: boolean
}

export interface DistanceDestination {
  id: number | string
  lat: number
  lon: number
}

export interface DistanceResult {
  id: number | string
  road_distance_m: number | null
  road_duration_s: number | null
  source: DistanceSource
  straight_distance_km: number
}

export interface DistanceResponse {
  results: DistanceResult[]
}

export interface VacanciesQuery {
  lat?: number
  lon?: number
  radius_km?: number
  cuerpo?: string[]
  especialidad?: string[]
  provincia?: string[]
  tipo?: string[]
  participacion?: string[]
  bbox?: string
  limit?: number
}
