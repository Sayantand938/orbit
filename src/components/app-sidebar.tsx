import {
    Timer,
    LayoutDashboard,
    History,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTimerStore, hasRunning } from "@/store/timer"
import { cn } from "@/lib/utils"
import type { Page } from "@/store/ui"

const navItems = [
    { id: "timer", label: "Timer", icon: Timer },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
] as const

interface AppSidebarProps {
    activePage: Page
    onNavigate: (page: Page) => void
    collapsed: boolean
    onToggle: () => void
}

export function AppSidebar({
    activePage,
    onNavigate,
    collapsed,
    onToggle,
}: AppSidebarProps) {
    const sessions = useTimerStore((s) => s.sessions)
    const isRunning = hasRunning(sessions)

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col shrink-0 sticky top-0 h-svh border-r border-border bg-sidebar transition-[width] duration-300 ease-in-out select-none",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header: Logo and collapse toggle */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-3">
                <div
                    className={cn(
                        "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
                        collapsed ? "w-0 opacity-0" : "w-auto opacity-100 pl-1"
                    )}
                >
                    <span className="font-heading text-lg font-semibold tracking-tight whitespace-nowrap">
                        Orbit
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "size-8 shrink-0 transition-transform duration-200",
                        collapsed && "mx-auto"
                    )}
                    onClick={onToggle}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <PanelLeftOpen className="size-4" />
                    ) : (
                        <PanelLeftClose className="size-4" />
                    )}
                </Button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1.5 p-2 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activePage === item.id
                    const showRunningPulse = item.id === "timer" && isRunning

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "group relative flex w-full items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors outline-hidden",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                collapsed ? "justify-center px-0" : "justify-start"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <div className="relative flex size-5 shrink-0 items-center justify-center">
                                <Icon className="size-5 shrink-0" />
                                {showRunningPulse && collapsed && (
                                    <span className="absolute -top-0.5 -right-0.5 flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                    </span>
                                )}
                            </div>

                            <span
                                className={cn(
                                    "overflow-hidden whitespace-nowrap text-left transition-all duration-300 ease-in-out",
                                    collapsed
                                        ? "w-0 opacity-0 ml-0"
                                        : "w-auto opacity-100 ml-3"
                                )}
                            >
                                {item.label}
                            </span>

                            {showRunningPulse && !collapsed && (
                                <span className="ml-auto flex size-2 shrink-0">
                                    <span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}