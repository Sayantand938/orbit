import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/stat-card"
import {
    useTimerStore,
    getRunningSession,
    sumDuration,
    dailyTotals,
    type DailyTotal,
} from "@/store/timer"
import { useNowWhenRunning } from "@/hooks/use-now-when-running"
import {
    formatDayMonth,
    formatDuration,
    formatMonthYear,
    formatWeekday,
} from "@/lib/format"
import { DASHBOARD } from "@/lib/config"
import { cn } from "@/lib/utils"

export function Dashboard() {
    const sessions = useTimerStore((s) => s.sessions)
    const now = useNowWhenRunning(sessions)

    const running = getRunningSession(sessions)

    const allDays = useMemo(() => dailyTotals(sessions, now), [sessions, now])
    const studiedDays = useMemo(
        () => allDays.filter((d) => d.ms > 0),
        [allDays]
    )

    const totalMs = useMemo(() => sumDuration(sessions, now), [sessions, now])

    const sessionCount = sessions.length
    const avgSessionMs = sessionCount > 0 ? totalMs / sessionCount : 0
    const avgDailyMs =
        studiedDays.length > 0 ? totalMs / studiedDays.length : 0

    const best = useMemo<DailyTotal | null>(() => {
        if (studiedDays.length === 0) return null
        return studiedDays.reduce((a, b) => (b.ms > a.ms ? b : a))
    }, [studiedDays])

    const worst = useMemo<DailyTotal | null>(() => {
        if (studiedDays.length === 0) return null
        return studiedDays.reduce((a, b) => (b.ms < a.ms ? b : a))
    }, [studiedDays])

    const eightHourDays = useMemo(
        () => studiedDays.filter((d) => d.ms >= DASHBOARD.EIGHT_HOURS_MS).length,
        [studiedDays]
    )

    // Every day of the current month up to and including today, newest first.
    const monthDays = useMemo<DailyTotal[]>(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const byTime = new Map(allDays.map((d) => [d.date.getTime(), d]))

        const out: DailyTotal[] = []
        const cursor = new Date(today)
        while (cursor >= firstOfMonth) {
            const date = new Date(cursor)
            date.setHours(0, 0, 0, 0)
            out.push(
                byTime.get(date.getTime()) ?? { date, ms: 0, sessions: 0 }
            )
            cursor.setDate(cursor.getDate() - 1)
        }
        return out
    }, [allDays])

    const today = useMemo(() => {
        const t = new Date()
        t.setHours(0, 0, 0, 0)
        return t
    }, [])

    const hasData = studiedDays.length > 0

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">
                    A quick look at how you&apos;ve been spending your time.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Total time studied"
                    value={formatDuration(totalMs)}
                    hint={
                        running ? (
                            <Badge variant="secondary">Running</Badge>
                        ) : undefined
                    }
                />
                <StatCard
                    label="Avg session"
                    value={formatDuration(avgSessionMs)}
                    hint={
                        hasData ? (
                            <span className="text-xs text-muted-foreground">
                                {sessionCount}{" "}
                                {sessionCount === 1 ? "session" : "sessions"}
                            </span>
                        ) : undefined
                    }
                />
                <StatCard
                    label="Avg daily"
                    value={formatDuration(avgDailyMs)}
                    hint={
                        hasData ? (
                            <span className="text-xs text-muted-foreground">
                                {studiedDays.length}{" "}
                                {studiedDays.length === 1 ? "day" : "days"}
                            </span>
                        ) : undefined
                    }
                />
                <StatCard
                    label="Most productive"
                    value={best ? formatDuration(best.ms) : "—"}
                    hint={
                        best ? (
                            <span className="text-xs text-muted-foreground">
                                {formatDayMonth(best.date)}
                            </span>
                        ) : undefined
                    }
                />
                <StatCard
                    label="Least productive"
                    value={worst ? formatDuration(worst.ms) : "—"}
                    hint={
                        worst ? (
                            <span className="text-xs text-muted-foreground">
                                {formatDayMonth(worst.date)}
                            </span>
                        ) : undefined
                    }
                />
                <StatCard
                    label="8+ hour days"
                    value={
                        hasData
                            ? `${eightHourDays} / ${studiedDays.length}`
                            : "0 / 0"
                    }
                    hint={
                        hasData ? (
                            <span className="text-xs text-muted-foreground">
                                {Math.round(
                                    (eightHourDays / studiedDays.length) * 100
                                )}
                                %
                            </span>
                        ) : undefined
                    }
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{formatMonthYear(today)}</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs text-muted-foreground">
                                <th className="py-2 text-left font-medium">
                                    Day
                                </th>
                                <th className="py-2 text-right font-medium">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthDays.map(({ date, ms }) => {
                                const isToday =
                                    date.getTime() === today.getTime()
                                const active = ms > 0
                                return (
                                    <tr
                                        key={date.toISOString()}
                                        className={cn(
                                            "border-b border-border/60 last:border-b-0",
                                            isToday && "font-medium"
                                        )}
                                    >
                                        <td className="py-2">
                                            <span className="text-muted-foreground">
                                                {formatWeekday(date)}
                                            </span>{" "}
                                            <span className="font-mono tabular-nums">
                                                {formatDayMonth(date)}
                                            </span>
                                            {isToday && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    today
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 text-right font-mono tabular-nums">
                                            {active ? formatDuration(ms) : "—"}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}