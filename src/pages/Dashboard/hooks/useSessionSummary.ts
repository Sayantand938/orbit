import { useMemo } from "react"
import { startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useSessions } from "@/hooks/useSessions"

function getDurationMinutes(start?: string | null, end?: string | null): number {
    if (!start || !end) return 0
    const s = new Date(start)
    const e = new Date(end)
    return Math.max(0, (e.getTime() - s.getTime()) / 60000)
}

export function useSessionSummary(range: DateRange | undefined) {
    const { data: sessions = [], isLoading } = useSessions()

    return useMemo(() => {
        const filtered = sessions.filter((s) => {
            if (!s.startTime) return false
            const dt = new Date(s.startTime)
            if (!range?.from && !range?.to) return true
            let inRange = true
            if (range?.from) {
                inRange = inRange && dt >= startOfDay(range.from)
            }
            if (range?.to) {
                inRange = inRange && dt <= endOfDay(range.to)
            }
            return inRange
        })

        const categories: Record<string, number> = {}
        for (const s of filtered) {
            const cat = s.category || "Uncategorized"
            const dur = getDurationMinutes(s.startTime, s.endTime)
            categories[cat] = (categories[cat] || 0) + dur
        }
        const entries = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .map(([category, minutes]) => ({ category, minutes }))
        const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0)

        return { entries, totalMinutes, isLoading }
    }, [sessions, range, isLoading])
}