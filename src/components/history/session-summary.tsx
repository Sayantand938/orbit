import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { HISTORY } from "@/lib/config"
import { formatClock, formatDuration, pad } from "@/lib/format"

interface SessionSummaryProps {
    index: number
    start_time: number
    end_time: number
    running?: boolean
    continuedFromPreviousDay?: boolean
    continuesToNextDay?: boolean
    actions?: ReactNode
}

export function SessionSummary({
    index,
    start_time,
    end_time,
    running = false,
    continuedFromPreviousDay = false,
    continuesToNextDay = false,
    actions,
}: SessionSummaryProps) {
    const duration = Math.max(0, end_time - start_time)
    // A slice that continues past midnight ends at 24:00:00
    const endLabel = continuesToNextDay ? "24:00:00" : formatClock(end_time)

    return (
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Session index + Start → End times + Rollover/Running badges */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                    {pad(index, HISTORY.SERIAL_PAD)}
                </span>

                {continuedFromPreviousDay && (
                    <span
                        className="rounded bg-muted/80 px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
                        title="Continued from previous day"
                    >
                        prev
                    </span>
                )}

                <div className="flex items-center gap-1.5 font-mono text-sm tabular-nums text-foreground sm:text-base">
                    <span>{formatClock(start_time)}</span>
                    <span className="text-muted-foreground">→</span>
                    {running ? (
                        <span className="text-muted-foreground">now</span>
                    ) : (
                        <span>{endLabel}</span>
                    )}
                </div>

                {running && <Badge variant="secondary">Running</Badge>}

                {continuesToNextDay && (
                    <span
                        className="rounded bg-muted/80 px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
                        title="Continues into next day"
                    >
                        next
                    </span>
                )}
            </div>

            {/* Duration display and Actions menu */}
            <div className="flex items-center justify-between border-t border-border/40 pt-2 sm:justify-end sm:border-t-0 sm:pt-0 sm:gap-3">
                <span className="text-xs text-muted-foreground sm:hidden">
                    Duration
                </span>
                <div className="flex items-center gap-2">
                    <span className="font-martian text-sm font-semibold tabular-nums sm:text-base">
                        {formatDuration(duration)}
                    </span>
                    {actions}
                </div>
            </div>
        </div>
    )
}