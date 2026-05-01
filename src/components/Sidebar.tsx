import { AddressInput } from "@/components/AddressInput"
import { RadiusSlider } from "@/components/RadiusSlider"
import { VacancyList } from "@/components/VacancyList"
import { useVacancies } from "@/hooks/useVacancies"

export function Sidebar() {
  const { data, isLoading } = useVacancies()

  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
      <div className="space-y-4 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <AddressInput />
        <RadiusSlider />
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
  )
}
