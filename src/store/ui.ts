import { create } from "zustand"
import { persist } from "zustand/middleware"
import { STORAGE_KEYS } from "@/lib/config"

export type Page = "timer" | "dashboard" | "history" | "settings"

type UiState = {
    page: Page
    sidebarCollapsed: boolean
    setPage: (page: Page) => void
    toggleSidebar: () => void
}

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            page: "timer",
            sidebarCollapsed: false,
            setPage: (page) => set({ page }),
            toggleSidebar: () =>
                set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
        }),
        { name: STORAGE_KEYS.UI }
    )
)