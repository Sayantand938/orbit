import { useEffect, useState } from "react"
import { TIMER } from "@/lib/config"
import { hasRunning, type Session } from "@/store/timer"

/**
 * Returns a `now` timestamp that ticks while at least one session is running,
 * and stays frozen otherwise.
 *
 * @param intervalMs How often to update `now`. Defaults to
 *   `TIMER.DEFAULT_TICK_MS` (1 Hz), which is fine for History/Dashboard.
 *   Pass `TIMER.TICK_MS` for sub-second precision on the Timer page.
 */
export function useNowWhenRunning(
    sessions: Session[],
    intervalMs: number = TIMER.DEFAULT_TICK_MS
) {
    const [now, setNow] = useState(() => Date.now())
    const running = hasRunning(sessions)

    useEffect(() => {
        if (!running) return

        // Sync immediately so the first frame after starting isn't stale.
        setNow(Date.now())

        const id = setInterval(() => setNow(Date.now()), intervalMs)
        return () => clearInterval(id)
    }, [running, intervalMs])

    return now
}