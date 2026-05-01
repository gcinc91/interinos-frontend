import { useState } from "react"

import { useGeocode } from "@/hooks/useGeocode"
import { useUIStore } from "@/store/uiStore"

export function AddressInput() {
  const origin = useUIStore((s) => s.origin)
  const setOrigin = useUIStore((s) => s.setOrigin)
  const geocode = useGeocode()
  const [value, setValue] = useState(origin?.address ?? "")

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const addr = value.trim()
    if (!addr) return
    try {
      const result = await geocode.mutateAsync(addr)
      setOrigin({ address: addr, lat: result.lat, lon: result.lon })
    } catch {
      /* error mostrado abajo */
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Tu dirección
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Sevilla, calle..."
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={geocode.isPending || !value.trim()}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {geocode.isPending ? "..." : "Buscar"}
        </button>
      </div>
      {geocode.isError && (
        <p className="text-xs text-rose-600">No se encontró esa dirección.</p>
      )}
      {origin && !geocode.isError && (
        <p className="text-xs text-zinc-500">
          Centrado en {origin.lat.toFixed(4)}, {origin.lon.toFixed(4)}
        </p>
      )}
    </form>
  )
}
