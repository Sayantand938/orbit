import { StatCard } from "@/components/stat-card"
import { formatDuration } from "@/lib/format"
import { sumSliceDuration, type SessionSlice } from "@/store/timer"

interface SessionStatsProps {
    slices: SessionSlice[]
}

export function SessionStats({ slices }: SessionStatsProps) {
    const count = slices.length
    const totalMs = sumSliceDuration(slices)
    const avgMs = count > 0 ? totalMs / count : 0
    const longestMs = slices.reduce(
        (max, s) => Math.max(max, s.end_time - s.start_time),
        0
    )

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                size="sm"
                label="Total time"
                value={formatDuration(totalMs)}
            />
            <StatCard
                size="sm"
                label="Avg session"
                value={formatDuration(avgMs)}
            />
            <StatCard size="sm" label="Sessions" value={String(count)} />
            <StatCard
                size="sm"
                label="Longest"
                value={formatDuration(longestMs)}
            />
        </div>
    )
}