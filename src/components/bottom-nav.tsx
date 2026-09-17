import { Timer, LayoutDashboard, History, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Page } from "@/store/ui"

const navItems = [
    { id: "timer", label: "Timer", icon: Timer },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
] as const

interface BottomNavProps {
    activePage: Page
    onNavigate: (page: Page) => void
}

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 md:hidden">
            <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activePage === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="size-5" />
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}