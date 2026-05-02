import { AddressInput } from "@/components/AddressInput"
import { Filters } from "@/components/Filters"
import { RadiusSlider } from "@/components/RadiusSlider"
import { VacancyList } from "@/components/VacancyList"
import { useVacancies } from "@/hooks/useVacancies"

export function Sidebar() {
  const { data, isLoading } = useVacancies()

  return (
    <aside className="flex h-full w-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="shrink-0 space-y-4 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <AddressInput />
        <RadiusSlider />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
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
        <div className="p-3">
          <VacancyList />
        </div>
      </div>
    </aside>
  )
}
