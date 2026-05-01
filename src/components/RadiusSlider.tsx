import { useUIStore } from "@/store/uiStore"

export function RadiusSlider() {
  const radiusKm = useUIStore((s) => s.radiusKm)
  const setRadiusKm = useUIStore((s) => s.setRadiusKm)

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Radio
        </label>
        <span className="text-xs text-zinc-500">{radiusKm} km</span>
      </div>
      <input
        type="range"
        min={1}
        max={100}
        step={1}
        value={radiusKm}
        onChange={(e) => setRadiusKm(Number(e.target.value))}
        className="w-full accent-emerald-600"
      />
    </div>
  )
}
