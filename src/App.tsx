import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageErrorFallback } from "@/components/error-fallbacks"
import { useUiStore } from "@/store/ui"
import { Timer } from "@/pages/Timer"
import { Dashboard } from "@/pages/Dashboard"
import { History } from "@/pages/History"
import { Settings } from "@/pages/Settings"

export function App() {
  const page = useUiStore((s) => s.page)
  const setPage = useUiStore((s) => s.setPage)
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  const renderPage = () => {
    switch (page) {
      case "timer":
        return <Timer />
      case "dashboard":
        return <Dashboard />
      case "history":
        return <History />
      case "settings":
        return <Settings />
      default:
        return <Timer />
    }
  }

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          activePage={page}
          onNavigate={setPage}
          collapsed={collapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main content — extra bottom padding on mobile for the tab bar */}
      <main className="flex-1 overflow-auto p-4 pb-24 sm:p-6 md:pb-6">
        <ErrorBoundary
          key={page}
          fallback={(reset) => <PageErrorFallback onReset={reset} />}
        >
          {renderPage()}
        </ErrorBoundary>
      </main>

      {/* Mobile bottom tab bar */}
      <BottomNav activePage={page} onNavigate={setPage} />
    </div>
  )
}

export default App