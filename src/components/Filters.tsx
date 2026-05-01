import { useState } from "react"

import { useFilters } from "@/hooks/useFilters"
import { type Filters as FiltersState, useUIStore } from "@/store/uiStore"

interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
}

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition ${
        active
          ? "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  )
}

interface ChipGroupProps {
  title: string
  filterKey: keyof FiltersState
  options: string[]
  defaultOpen?: boolean
  truncate?: number
}

function ChipGroup({ title, filterKey, options, defaultOpen = true }: ChipGroupProps) {
  const selected = useUIStore((s) => s.filters[filterKey])
  const setFilter = useUIStore((s) => s.setFilter)
  const [open, setOpen] = useState(defaultOpen)

  if (options.length === 0) return null

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    setFilter(filterKey, next)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          {title}
          {selected.length > 0 && (
            <span className="ml-2 text-emerald-600">{selected.length}</span>
          )}
        </h3>
        <span className="text-zinc-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {options.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              active={selected.includes(opt)}
              onClick={() => toggle(opt)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Filters() {
  const { data, isLoading } = useFilters()
  const filtersState = useUIStore((s) => s.filters)
  const resetFilters = useUIStore((s) => s.resetFilters)
  const totalSelected =
    filtersState.cuerpos.length +
    filtersState.especialidades.length +
    filtersState.provincias.length +
    filtersState.tipos.length +
    filtersState.participaciones.length

  if (isLoading || !data) {
    return <p className="text-xs text-zinc-500">Cargando filtros…</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Filtros
        </h2>
        {totalSelected > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            limpiar ({totalSelected})
          </button>
        )}
      </div>
      <ChipGroup title="Cuerpo" filterKey="cuerpos" options={data.cuerpos} />
      <ChipGroup title="Provincia" filterKey="provincias" options={data.provincias} />
      <ChipGroup title="Tipo" filterKey="tipos" options={data.tipos} />
      <ChipGroup
        title="Participación"
        filterKey="participaciones"
        options={data.participaciones}
      />
      <ChipGroup
        title="Especialidad"
        filterKey="especialidades"
        options={data.especialidades}
        defaultOpen={false}
      />
    </div>
  )
}
