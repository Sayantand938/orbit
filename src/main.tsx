import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { ErrorBoundary } from "@/components/error-boundary"
import { AppErrorFallback } from "@/components/error-fallbacks"
import { useTimerStore } from "@/store/timer"
import { STORAGE_KEYS } from "@/lib/config"

async function bootstrap() {
  // One-time cleanup: the timer store moved to IndexedDB. Any leftover
  // localStorage entry from a previous version is dead weight — nothing
  // reads it anymore, and it inflates the storage.estimate() reading.
  try {
    localStorage.removeItem(STORAGE_KEYS.TIMER)
  } catch {
    // localStorage blocked (private mode, sandboxed iframe) — non-fatal.
  }

  // Ask the browser to keep our IndexedDB data around under storage
  // pressure. Best-effort — Safari and some contexts ignore it.
  try {
    await navigator.storage?.persist?.()
  } catch {
    // Non-fatal.
  }

  // Hydrate the timer store from IndexedDB before the first render so
  // we never flash an empty state.
  try {
    await useTimerStore.persist.rehydrate()
  } catch (err) {
    console.error("Failed to hydrate timer store:", err)
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary fallback={(reset) => <AppErrorFallback onReset={reset} />}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}

void bootstrap()