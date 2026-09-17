import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    useTimerStore,
    getRunningSession,
    sessionDuration,
} from "@/store/timer"
import { useNowWhenRunning } from "@/hooks/use-now-when-running"
import { formatTimeParts } from "@/lib/format"
import { TIMER } from "@/lib/config"

export function Timer() {
    const sessions = useTimerStore((s) => s.sessions)
    const start = useTimerStore((s) => s.start)
    const stop = useTimerStore((s) => s.stop)
    const discard = useTimerStore((s) => s.discard)

    const runningSession = getRunningSession(sessions)
    const running = runningSession !== null

    const now = useNowWhenRunning(sessions, TIMER.TICK_MS)

    const handleStartStop = () => {
        if (running) {
            stop()
        } else {
            start()
        }
    }

    const elapsed = runningSession ? sessionDuration(runningSession, now) : 0
    const { main, centiseconds } = formatTimeParts(elapsed)

    return (
        <div className="flex h-full flex-col items-center justify-center gap-8">
            <div className="flex items-baseline gap-1 font-mono tabular-nums">
                <span className="text-7xl font-semibold tracking-tight sm:text-8xl">
                    {main}
                </span>
                <span className="text-3xl font-medium text-muted-foreground sm:text-4xl">
                    .{centiseconds}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    size="lg"
                    onClick={handleStartStop}
                    className="min-w-28"
                    variant={running ? "secondary" : "default"}
                >
                    {running ? (
                        <>
                            <Pause className="size-4" />
                            Stop
                        </>
                    ) : (
                        <>
                            <Play className="size-4" />
                            Start
                        </>
                    )}
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    onClick={discard}
                    disabled={!running}
                    title="Discard the current run"
                >
                    <RotateCcw className="size-4" />
                    Reset
                </Button>
            </div>
        </div>
    )
}