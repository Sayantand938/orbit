import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
    label: string
    value: string
    hint?: ReactNode
    /** "sm" renders a smaller label and value. Defaults to "default". */
    size?: "default" | "sm"
}

export function StatCard({
    label,
    value,
    hint,
    size = "default",
}: StatCardProps) {
    return (
        <Card size="sm">
            <CardHeader>
                <CardTitle
                    className={cn(
                        "flex items-center justify-between gap-2 font-medium text-muted-foreground",
                        size === "sm" ? "text-xs" : "text-sm"
                    )}
                >
                    <span>{label}</span>
                    {hint}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <span
                    className={cn(
                        "font-mono font-semibold tabular-nums",
                        size === "sm" ? "text-xl" : "text-2xl"
                    )}
                >
                    {value}
                </span>
            </CardContent>
        </Card>
    )
}