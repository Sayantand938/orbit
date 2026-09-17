import { useMemo, useState, type ReactNode } from "react"
import { DatePicker } from "@/components/history/date-picker"
import { SessionList } from "@/components/history/session-list"
import { SessionStats } from "@/components/history/session-stats"
import { HourlyStats } from "@/components/history/hourly-stats"
import { EditSessionDialog } from "@/components/edit-session-dialog"
import {
    sliceSessionsOn,
    useTimerStore,
    type Session,
    type SessionSlice,
} from "@/store/timer"
import { useNowWhenRunning } from "@/hooks/use-now-when-running"
import { cn } from "@/lib/utils"

type View = "logs" | "hourly"

export function History() {
    const sessions = useTimerStore((s) => s.sessions)
    const updateSession = useTimerStore((s) => s.updateSession)
    const deleteSession = useTimerStore((s) => s.deleteSession)

    const [date, setDate] = useState<Date>(() => new Date())
    const [view, setView] = useState<View>("logs")
    const [editingSession, setEditingSession] = useState<Session | null>(null)
    const [editOpen, setEditOpen] = useState(false)

    const now = useNowWhenRunning(sessions)

    const daySlices = useMemo(
        () => sliceSessionsOn(sessions, date, now),
        [sessions, date, now]
    )

    const handleEdit = (slice: SessionSlice) => {
        setEditingSession(slice.session)
        setEditOpen(true)
    }

    const handleDelete = (id: string) => {
        deleteSession(id)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">History</h1>
                    <p className="text-muted-foreground">
                        Review your tracked sessions by day.
                    </p>
                </div>
                <DatePicker date={date} onChange={setDate} />
            </div>

            <SessionStats slices={daySlices} />

            <div className="flex">
                <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
                    <ViewButton
                        active={view === "logs"}
                        onClick={() => setView("logs")}
                    >
                        Logs
                    </ViewButton>
                    <ViewButton
                        active={view === "hourly"}
                        onClick={() => setView("hourly")}
                    >
                        Hourly
                    </ViewButton>
                </div>
            </div>

            {view === "logs" ? (
                <SessionList
                    slices={daySlices}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <HourlyStats slices={daySlices} />
            )}

            <EditSessionDialog
                session={editingSession}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSave={(start, end) => {
                    if (editingSession) {
                        updateSession(editingSession.id, start, end)
                    }
                }}
            />
        </div>
    )
}

function ViewButton({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            {children}
        </button>
    )
}