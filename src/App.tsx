import { Menu } from "lucide-react"

import { MapView } from "@/components/Map"
import { Sidebar } from "@/components/Sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { UpdateToast } from "@/components/UpdateToast"
import { VacancyDetail } from "@/components/VacancyDetail"
import { useTheme } from "@/hooks/useTheme"
import { useUrlState } from "@/hooks/useUrlState"
import { useVacanciesVersion } from "@/hooks/useVacanciesVersion"
import { useUIStore } from "@/store/uiStore"

function App() {
  useTheme()
  useUrlState()
  const versionQuery = useVacanciesVersion()
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)
  const status: "loading" | "ok" | "error" = versionQuery.isError
    ? "error"
    : versionQuery.isLoading
      ? "loading"
      : "ok"

  return (
    <div className="flex h-screen flex-col">
      <header className="relative z-40 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-semibold tracking-tight">Interinos</h1>
            <span className="hidden text-xs text-zinc-500 sm:inline">
              vacantes Andalucía
            </span>
          </div>
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

      <div className="relative flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative min-w-0 flex-1">
          <MapView />
        </main>
      </div>
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
