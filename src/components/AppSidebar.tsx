import { NavLink, useNavigate } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Rotate3D, Wallet, FileText, Clock, Settings, LogOut, LayoutDashboard } from "lucide-react" // 👈 added LayoutDashboard
import { useAuth } from "@/contexts/AuthContext"

const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" }, // 👈 new
    { title: "Transactions", icon: Wallet, url: "/transactions" },
    { title: "Logs", icon: FileText, url: "/logs" },
    { title: "Sessions", icon: Clock, url: "/sessions" },
    { title: "Settings", icon: Settings, url: "/settings" },
]

export function AppSidebar() {
    const { signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            await signOut()
            navigate("/login")
        } catch (error) {
            console.error("Failed to sign out", error)
        }
    }

    return (
        <Sidebar
            className="bg-sidebar border-r border-sidebar-border"
            collapsible="icon"
        >
            <SidebarHeader className="border-b border-sidebar-border p-4 group-data-[state=collapsed]:p-2">
                <div className="flex items-center justify-between group-data-[state=collapsed]:justify-center">
                    <div className="flex items-center gap-3 group-data-[state=collapsed]:hidden">
                        <Rotate3D className="size-6 text-primary" />
                        <span className="text-lg font-semibold tracking-tight">Orbit</span>
                    </div>
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
                                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-base"
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

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-destructive hover:text-destructive text-base"
                        >
                            <LogOut className="size-4" />
                            <span className="group-data-[state=collapsed]:hidden">Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}