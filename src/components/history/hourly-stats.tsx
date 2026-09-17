import { Card, CardContent } from "@/components/ui/card"
import { HISTORY } from "@/lib/config"
import { formatDuration, pad } from "@/lib/format"
import { hourlyBreakdown, type SessionSlice } from "@/store/timer"
import { cn } from "@/lib/utils"

interface HourlyStatsProps {
    slices: SessionSlice[]
}

export function HourlyStats({ slices }: HourlyStatsProps) {
    const hours = hourlyBreakdown(slices)

    return (
        <Card>
            <CardContent>
                <ul className="flex flex-col">
                    {hours.map((ms, h) => {
                        const active = ms > 0
                        const pct =
                            Math.min(ms / HISTORY.HOURLY_FULL_SCALE_MS, 1) * 100
                        return (
                            <li
                                key={h}
                                className="flex items-center gap-4 py-1.5"
                            >
                                <span
                                    className={cn(
                                        "w-14 font-mono text-sm tabular-nums",
                                        active
                                            ? "text-foreground"
                                            : "text-muted-foreground/40"
                                    )}
                                >
                                    {pad(h)}:00
                                </span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/40">
                                    {active && (
                                        <div
                                            className="h-full rounded-full bg-primary/70"
                                            style={{ width: `${pct}%` }}
                                        />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "w-20 text-right font-mono text-sm tabular-nums",
                                        active
                                            ? "text-foreground"
                                            : "text-muted-foreground/40"
                                    )}
                                >
                                    {active ? formatDuration(ms) : "—"}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </CardContent>
        </Card>
    )
}