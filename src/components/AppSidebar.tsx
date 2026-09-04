import { NavLink } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Rotate3D, Wallet, FileText, Clock, Settings } from "lucide-react"

const menuItems = [
    { title: "Transactions", icon: Wallet, url: "/transactions" },
    { title: "Logs", icon: FileText, url: "/logs" },
    { title: "Sessions", icon: Clock, url: "/sessions" },
    { title: "Settings", icon: Settings, url: "/settings" },
]

export function AppSidebar() {
    return (
        <Sidebar
            className="bg-sidebar border-r border-sidebar-border"
            collapsible="icon"
        >
            <SidebarHeader className="border-b border-sidebar-border p-4 group-data-[state=collapsed]:p-2">
                <div className="flex items-center justify-between group-data-[state=collapsed]:justify-center">
                    {/* Brand container – hidden when collapsed */}
                    <div className="flex items-center gap-3 group-data-[state=collapsed]:hidden">
                        <Rotate3D className="size-6 text-primary" />
                        <span className="text-lg font-semibold tracking-tight">Orbit</span>
                    </div>
                    {/* Collapse button – always visible, centered when collapsed */}
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground group-data-[state=collapsed]:size-4" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        render={<NavLink to={item.url} />}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                                    >
                                        <item.icon className="size-4" />
                                        <span className="group-data-[state=collapsed]:hidden">
                                            {item.title}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}