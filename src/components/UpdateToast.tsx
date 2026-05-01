import { useEffect, useRef, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"

import { useVacanciesVersion } from "@/hooks/useVacanciesVersion"

/**
 * Muestra un toast cuando `/vacancies/version` cambia desde la primera lectura.
 * El usuario puede actualizar (invalida `useVacancies`) o descartar.
 */
export function UpdateToast() {
  const versionQuery = useVacanciesVersion()
  const queryClient = useQueryClient()
  const lastSeenRef = useRef<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const current = versionQuery.data?.data_version
    if (!current) return
    if (lastSeenRef.current === null) {
      lastSeenRef.current = current
      return
    }
    if (lastSeenRef.current !== current && !visible) {
      setVisible(true)
    }
  }, [versionQuery.data?.data_version, visible])

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["vacancies"] })
    void queryClient.invalidateQueries({ queryKey: ["filters"] })
    lastSeenRef.current = versionQuery.data?.data_version ?? null
    setVisible(false)
  }

  const dismiss = () => {
    lastSeenRef.current = versionQuery.data?.data_version ?? null
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm shadow-lg dark:border-emerald-700 dark:bg-zinc-900">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-zinc-700 dark:text-zinc-200">
          Nuevas vacantes disponibles
        </span>
        <button
          type="button"
          onClick={refresh}
          className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
        >
          Actualizar
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Descartar"
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
