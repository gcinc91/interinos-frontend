import "@testing-library/jest-dom/vitest"

// matchMedia mock para useTheme y posibles queries CSS-in-JS.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
      onchange: null,
    }),
  })
}

// localStorage en jsdom puede inicializarse después que zustand/persist
// importa. Forzamos un mock determinista.
const _memStore: Record<string, string> = {}
const localStorageMock: Storage = {
  getItem: (k) => (k in _memStore ? _memStore[k] : null),
  setItem: (k, v) => {
    _memStore[k] = String(v)
  },
  removeItem: (k) => {
    delete _memStore[k]
  },
  clear: () => {
    for (const k of Object.keys(_memStore)) delete _memStore[k]
  },
  key: () => null,
  length: 0,
}
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
})
