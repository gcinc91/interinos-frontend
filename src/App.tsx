import { useEffect, useState } from "react"

import { fetchHealth, fetchVacanciesVersion } from "@/services/api"

type Status = "loading" | "ok" | "error"

function App() {
  const [status, setStatus] = useState<Status>("loading")
  const [version, setVersion] = useState<string | null>(null)
  const [itemsActive, setItemsActive] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        await fetchHealth()
        const v = await fetchVacanciesVersion()
        if (cancelled) return
        setVersion(v.data_version)
        setItemsActive(v.items_active)
        setStatus("ok")
      } catch {
        if (cancelled) return
        setStatus("error")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold">Interinos</h1>
          <span className="text-xs text-zinc-500">vacantes Andalucía</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <StatusDot status={status} />
          {status === "ok" && itemsActive !== null && (
            <span className="text-zinc-500">
              {itemsActive} vacantes ·{" "}
              <code className="font-mono text-[10px]">{version?.slice(0, 12)}</code>
            </span>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[360px] overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Sidebar
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            Filtros + lista de vacantes (Fase 8/9)
          </p>
        </aside>

        <main className="grid flex-1 place-items-center bg-zinc-50 dark:bg-zinc-900">
          <div className="text-center">
            <p className="text-sm text-zinc-500">Mapa (Fase 8)</p>
            <p className="mt-1 text-xs text-zinc-400">
              Leaflet + react-leaflet + MarkerCluster
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: Status }) {
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
