import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

export function SidebarLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden pt-4 px-4">
                {/* Header with trigger */}
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <SidebarTrigger />
                    <span className="text-lg font-semibold">Orbit</span>
                </div>
                {/* Page content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}