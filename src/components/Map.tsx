import { useEffect, useMemo } from "react"

import L from "leaflet"
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"

import { useVacancies } from "@/hooks/useVacancies"
import "@/lib/leaflet-icons"
import { makeVacancyIcon } from "@/lib/leaflet-icons"
import { ANDALUSIA_BOUNDS, ANDALUSIA_CENTER, useUIStore } from "@/store/uiStore"
import type { VacancySummary } from "@/types/api"

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function FollowOrigin() {
  const map = useMap()
  const origin = useUIStore((s) => s.origin)

  useEffect(() => {
    if (origin) {
      map.flyTo([origin.lat, origin.lon], 12, { duration: 0.6 })
    }
  }, [origin, map])

  return null
}

function FocusSelected({ vacancies }: { vacancies: VacancySummary[] }) {
  const map = useMap()
  const selectedId = useUIStore((s) => s.selectedId)

  useEffect(() => {
    if (selectedId === null) return
    const v = vacancies.find((x) => x.id === selectedId)
    if (!v) return
    map.flyTo([v.lat, v.lon], Math.max(map.getZoom(), 14), { duration: 0.4 })
  }, [selectedId, vacancies, map])

  return null
}

function BoundsTracker() {
  const setMapBounds = useUIStore((s) => s.setMapBounds)
  useMapEvents({
    moveend: (e) => {
      const b = e.target.getBounds()
      setMapBounds({
        minLon: b.getWest(),
        minLat: b.getSouth(),
        maxLon: b.getEast(),
        maxLat: b.getNorth(),
      })
    },
  })
  return null
}

function VacancyMarkers({ vacancies }: { vacancies: VacancySummary[] }) {
  const hoveredId = useUIStore((s) => s.hoveredId)
  const selectedId = useUIStore((s) => s.selectedId)
  const setSelectedId = useUIStore((s) => s.setSelectedId)

  return (
    <>
      {vacancies.map((v) => {
        const highlighted = hoveredId === v.id || selectedId === v.id
        return (
          <Marker
            key={v.id}
            position={[v.lat, v.lon]}
            icon={makeVacancyIcon(v.cuerpo, highlighted)}
            eventHandlers={{
              click: () => setSelectedId(v.id),
            }}
          >
            <Popup>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-zinc-900">{v.centro}</p>
                <p className="text-zinc-600">{v.especialidad ?? v.cuerpo}</p>
                <p className="text-zinc-500">
                  {v.localidad}, {v.provincia}
                </p>
                {v.straight_distance_km !== null && (
                  <p className="text-zinc-700">
                    {v.straight_distance_km.toFixed(1)} km en línea recta
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

export function MapView() {
  const origin = useUIStore((s) => s.origin)
  const radiusKm = useUIStore((s) => s.radiusKm)
  const { data: vacancies = [] } = useVacancies()

  const initialBounds = useMemo(() => L.latLngBounds(ANDALUSIA_BOUNDS), [])

  return (
    <MapContainer
      bounds={initialBounds}
      center={[ANDALUSIA_CENTER.lat, ANDALUSIA_CENTER.lon]}
      zoom={7}
      maxBounds={initialBounds.pad(0.5)}
      className="h-full w-full"
    >
      <TileLayer
        attribution={ATTRIBUTION}
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <BoundsTracker />
      <FollowOrigin />
      <FocusSelected vacancies={vacancies} />

      {origin && (
        <>
          <Marker position={[origin.lat, origin.lon]} />
          <Circle
            center={[origin.lat, origin.lon]}
            radius={radiusKm * 1000}
            pathOptions={{ color: "#10b981", weight: 1, fillOpacity: 0.05 }}
          />
        </>
      )}

      <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
        <VacancyMarkers vacancies={vacancies} />
      </MarkerClusterGroup>
    </MapContainer>
  )
}
