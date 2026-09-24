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
        <div className="flex h-full flex-col items-center justify-center gap-10 sm:gap-14 select-none">
            {/* Timer digits display */}
            <div className="flex items-baseline gap-1 font-martian tabular-nums select-none whitespace-nowrap">
                <span className="text-4xl min-[380px]:text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight">
                    {main}
                </span>
                <span className="text-lg min-[380px]:text-xl sm:text-3xl lg:text-4xl font-medium text-muted-foreground">
                    .{centiseconds}
                </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-5 sm:gap-6">
                {/* Play / Pause primary button */}
                <Button
                    onClick={handleStartStop}
                    variant={running ? "secondary" : "default"}
                    aria-label={running ? "Pause timer" : "Start timer"}
                    title={running ? "Pause timer" : "Start timer"}
                    className="size-16 sm:size-20 rounded-full p-0 shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    {running ? (
                        <Pause className="size-7 sm:size-8 fill-current" />
                    ) : (
                        <Play className="size-7 sm:size-8 fill-current translate-x-0.5" />
                    )}
                </Button>

                {/* Reset button */}
                <Button
                    variant="outline"
                    onClick={discard}
                    disabled={!running}
                    aria-label="Reset timer"
                    title="Reset timer"
                    className="size-12 sm:size-14 rounded-full p-0 border-border/80 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                >
                    <RotateCcw className="size-5 sm:size-6 text-muted-foreground" />
                </Button>
            </div>
        </div>
    )
}