import { Monitor, Moon, Sun } from "lucide-react"

import { type ThemePreference, useUIStore } from "@/store/uiStore"

const ORDER: ThemePreference[] = ["system", "light", "dark"]
const ICON: Record<ThemePreference, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}
const LABEL: Record<ThemePreference, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
}

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const Icon = ICON[theme]
  const cycle = () => {
    const idx = ORDER.indexOf(theme)
    setTheme(ORDER[(idx + 1) % ORDER.length])
  }
  return (
    <button
      type="button"
      onClick={cycle}
      title={`Tema: ${LABEL[theme]} (click para cambiar)`}
      className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
