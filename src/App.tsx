import { MapView } from "@/components/Map"
import { Sidebar } from "@/components/Sidebar"
import { VacancyDetail } from "@/components/VacancyDetail"
import { useUrlState } from "@/hooks/useUrlState"
import { useVacanciesVersion } from "@/hooks/useVacanciesVersion"

function App() {
  useUrlState()
  const versionQuery = useVacanciesVersion()
  const status: "loading" | "ok" | "error" = versionQuery.isError
    ? "error"
    : versionQuery.isLoading
      ? "loading"
      : "ok"

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold">Interinos</h1>
          <span className="text-xs text-zinc-500">vacantes Andalucía</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <StatusDot status={status} />
          {versionQuery.data && (
            <span className="text-zinc-500">
              {versionQuery.data.items_active} vacantes ·{" "}
              <code className="font-mono text-[10px]">
                {versionQuery.data.data_version?.slice(0, 12) ?? "—"}
              </code>
            </span>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative min-w-0 flex-1">
          <MapView />
        </main>
      </div>
      <VacancyDetail />
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
