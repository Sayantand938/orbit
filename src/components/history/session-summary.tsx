import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { formatClock, formatDuration } from "@/lib/format"

interface SessionSummaryProps {
    start_time: number
    end_time: number
    running?: boolean
    continuedFromPreviousDay?: boolean
    continuesToNextDay?: boolean
    actions?: ReactNode
}

export function SessionSummary({
    start_time,
    end_time,
    running = false,
    continuedFromPreviousDay = false,
    continuesToNextDay = false,
    actions,
}: SessionSummaryProps) {
    const duration = Math.max(0, end_time - start_time)
    // A slice that continues past midnight ends exactly at 24:00, which
    // formatClock would render as 00:00:00. Show 24:00:00 instead.
    const endLabel = continuesToNextDay ? "24:00:00" : formatClock(end_time)

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                {continuedFromPreviousDay && (
                    <span
                        className="rounded bg-muted/60 px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
                        title="Continued from previous day"
                    >
                        prev
                    </span>
                )}
                <span className="font-mono text-base tabular-nums">
                    {formatClock(start_time)}
                </span>
                <span className="text-muted-foreground">→</span>
                {running ? (
                    <>
                        <span className="font-mono text-base tabular-nums text-muted-foreground">
                            now
                        </span>
                        <Badge variant="secondary">Running</Badge>
                    </>
                ) : (
                    <>
                        <span className="font-mono text-base tabular-nums">
                            {endLabel}
                        </span>
                        {continuesToNextDay && (
                            <span
                                className="rounded bg-muted/60 px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
                                title="Continues into next day"
                            >
                                next
                            </span>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span className="font-mono text-base font-medium tabular-nums">
                    {formatDuration(duration)}
                </span>
                {actions}
            </div>
        </div>
    )
}