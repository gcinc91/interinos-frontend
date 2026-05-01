import { useQuery } from "@tanstack/react-query"

import { fetchVacancies } from "@/services/api"
import { useUIStore } from "@/store/uiStore"

export function useVacancies() {
  const origin = useUIStore((s) => s.origin)
  const radiusKm = useUIStore((s) => s.radiusKm)
  const filters = useUIStore((s) => s.filters)

  return useQuery({
    queryKey: ["vacancies", origin, radiusKm, filters],
    queryFn: () =>
      fetchVacancies({
        lat: origin?.lat,
        lon: origin?.lon,
        radius_km: origin ? radiusKm : undefined,
        cuerpo: filters.cuerpos.length > 0 ? filters.cuerpos : undefined,
        especialidad:
          filters.especialidades.length > 0 ? filters.especialidades : undefined,
        provincia: filters.provincias.length > 0 ? filters.provincias : undefined,
        tipo: filters.tipos.length > 0 ? filters.tipos : undefined,
        participacion:
          filters.participaciones.length > 0 ? filters.participaciones : undefined,
        limit: 1000,
      }),
  })
}
