import {
    Timer,
    LayoutDashboard,
    History,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
    return (
        <aside
            className={cn(
                "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-14 items-center border-b border-border px-4">
                {!collapsed && (
                    <span className="font-heading text-lg font-semibold">Orbit</span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("ml-auto", collapsed && "mx-auto")}
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

            <nav className="flex-1 space-y-1 p-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activePage === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="size-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}