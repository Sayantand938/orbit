import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { HISTORY } from "@/lib/config"
import { formatDuration, pad } from "@/lib/format"
import { hourlyBreakdown, type SessionSlice } from "@/store/timer"
import { cn } from "@/lib/utils"

interface HourlyStatsProps {
    slices: SessionSlice[]
}

const TARGET_MS = HISTORY.HOURLY_FULL_SCALE_MS // 30 minutes (1,800,000 ms)

export function HourlyStats({ slices }: HourlyStatsProps) {
    const rawHours = useMemo(() => hourlyBreakdown(slices), [slices])

    // Seamlessly balances surplus (>30m) into deficit sessions that can reach 30m
    const hours = useMemo(() => {
        const balanced = [...rawHours]

        // 1. Collect hours that have surplus past 30m
        const surplusHours: { hour: number; surplus: number }[] = []
        let totalSurplus = 0

        for (let h = 0; h < 24; h++) {
            if (balanced[h] > TARGET_MS) {
                const surplus = balanced[h] - TARGET_MS
                surplusHours.push({ hour: h, surplus })
                totalSurplus += surplus
            }
        }

        if (totalSurplus === 0) return balanced

        // 2. Find active deficit hours (0 < time < 30m), prioritizing those closest to 30m
        const deficitHours = balanced
            .map((ms, hour) => ({ hour, needed: TARGET_MS - ms }))
            .filter((item) => balanced[item.hour] > 0 && item.needed > 0)
            .sort((a, b) => a.needed - b.needed)

        if (deficitHours.length === 0) return balanced

        // 3. Determine allocation
        let surplusAvailable = totalSurplus
        let surplusNeeded = 0
        const allocations: { hour: number; added: number }[] = []

        for (const item of deficitHours) {
            if (surplusAvailable <= 0) break
            const fillAmount = Math.min(surplusAvailable, item.needed)
            allocations.push({ hour: item.hour, added: fillAmount })
            surplusAvailable -= fillAmount
            surplusNeeded += fillAmount
        }

        // 4. Deduct only the needed surplus from the surplus hours
        let deductionRemaining = surplusNeeded
        for (const item of surplusHours) {
            if (deductionRemaining <= 0) break
            const deduct = Math.min(deductionRemaining, item.surplus)
            balanced[item.hour] -= deduct
            deductionRemaining -= deduct
        }

        // 5. Apply the allocated time to the deficit hours
        for (const alloc of allocations) {
            balanced[alloc.hour] += alloc.added
        }

        return balanced
    }, [rawHours])

    return (
        <Card>
            <CardContent>
                <ul className="flex flex-col">
                    {hours.map((ms, h) => {
                        const active = ms > 0
                        const pct = Math.min(ms / TARGET_MS, 1) * 100

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
                                            className="h-full rounded-full bg-primary/70 transition-all duration-300"
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