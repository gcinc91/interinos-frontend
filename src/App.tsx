import { useEffect, useState } from "react"

import { Map as MapIcon, List } from "lucide-react"

import { MapView } from "@/components/Map"
import { Sidebar } from "@/components/Sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { UpdateToast } from "@/components/UpdateToast"
import { VacancyDetail } from "@/components/VacancyDetail"
import { useTheme } from "@/hooks/useTheme"
import { useUrlState } from "@/hooks/useUrlState"
import { useVacancies } from "@/hooks/useVacancies"
import { useVacanciesVersion } from "@/hooks/useVacanciesVersion"
import { useUIStore } from "@/store/uiStore"

function App() {
  useTheme()
  useUrlState()
  const versionQuery = useVacanciesVersion()
  const selectedId = useUIStore((s) => s.selectedId)
  const { data: vacancies } = useVacancies()
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map")

  const status: "loading" | "ok" | "error" = versionQuery.isError
    ? "error"
    : versionQuery.isLoading
      ? "loading"
      : "ok"

  // Switching to a vacancy on the list tab → jump to map to see it
  useEffect(() => {
    if (selectedId !== null) setMobileTab("map")
  }, [selectedId])

  return (
    <div className="flex h-dvh flex-col">
      <header className="relative z-40 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold tracking-tight">Interinos</h1>
          <span className="hidden text-xs text-zinc-500 sm:inline">
            vacantes Andalucía
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <StatusDot status={status} />
          {versionQuery.data && (
            <span className="hidden text-zinc-500 sm:inline">
              {versionQuery.data.items_active} vacantes ·{" "}
              <code className="font-mono text-[10px]">
                {versionQuery.data.data_version?.slice(0, 12) ?? "—"}
              </code>
            </span>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/*
        Mobile: both sidebar and map use absolute inset-0 so the map stays
        mounted (Leaflet must not be destroyed). The active panel sits on top.
        Desktop (lg+): classic flex row – sidebar fixed width, map fills rest.
      */}
      <div className="relative min-h-0 flex-1 lg:flex">
        {/* Sidebar panel */}
        <div
          className={`absolute inset-0 z-10 flex-col overflow-hidden lg:relative lg:inset-auto lg:z-auto lg:w-[360px] lg:shrink-0 ${
            mobileTab === "map" ? "hidden lg:flex" : "flex"
          }`}
        >
          <Sidebar />
        </div>

        {/* Map – always in DOM so Leaflet keeps its state */}
        <main
          className={`absolute inset-0 lg:relative lg:inset-auto lg:min-w-0 lg:flex-1 ${
            mobileTab === "list"
              ? "pointer-events-none invisible lg:visible lg:pointer-events-auto"
              : ""
          }`}
        >
          <MapView />
        </main>
      </div>

      {/* Bottom tab bar – mobile only */}
      <nav
        className="shrink-0 border-t border-zinc-200 bg-white lg:hidden dark:border-zinc-800 dark:bg-zinc-950"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-14">
        <button
          type="button"
          onClick={() => setMobileTab("map")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
            mobileTab === "map"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <MapIcon className="h-5 w-5" />
          Mapa
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("list")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
            mobileTab === "list"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <div className="relative">
            <List className="h-5 w-5" />
            {vacancies && vacancies.length > 0 && (
              <span className="absolute -right-2.5 -top-1.5 min-w-[1.25rem] rounded-full bg-emerald-500 px-1 text-center text-[9px] leading-4 text-white">
                {vacancies.length > 999 ? "999+" : vacancies.length}
              </span>
            )}
          </div>
          Lista
        </button>
        </div>
      </nav>

      <VacancyDetail />
      <UpdateToast />
    </div>
  )
}

function StatusDot({ status }: { status: "loading" | "ok" | "error" }) {
  const color =
    status === "ok"
      ? "bg-emerald-500"
      : status === "error"
        ? "bg-rose-500"
        : "bg-zinc-400 animate-pulse"
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${color}`}
      title={`API ${status}`}
    />
  )
}

export default App
