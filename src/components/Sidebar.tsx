import { X } from "lucide-react"

import { AddressInput } from "@/components/AddressInput"
import { Filters } from "@/components/Filters"
import { RadiusSlider } from "@/components/RadiusSlider"
import { VacancyList } from "@/components/VacancyList"
import { useVacancies } from "@/hooks/useVacancies"
import { useUIStore } from "@/store/uiStore"

export function Sidebar() {
  const { data, isLoading } = useVacancies()
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  return (
    <>
      {/* Backdrop sólo en mobile cuando está abierto */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 top-14 z-30 flex w-[85%] max-w-sm flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950 lg:relative lg:top-0 lg:w-[360px] lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 lg:hidden dark:border-zinc-800">
          <span className="text-sm font-medium">Filtros</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <AddressInput />
          <RadiusSlider />
        </div>
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <Filters />
        </div>
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800">
          <span>
            {isLoading
              ? "Cargando…"
              : `${data?.length ?? 0} vacante${data?.length === 1 ? "" : "s"}`}
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <VacancyList />
        </div>
      </aside>
    </>
  )
}
