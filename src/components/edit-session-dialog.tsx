import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DAY_MS, formatDuration, pad } from "@/lib/format"
import type { Session } from "@/store/timer"

function toTimeValue(ts: number) {
    const d = new Date(ts)
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function fromTimeValue(value: string, referenceTs: number) {
    const [h = 0, m = 0, s = 0] = value.split(":").map(Number)
    const d = new Date(referenceTs)
    d.setHours(h, m, s, 0)
    return d.getTime()
}

interface EditSessionDialogProps {
    session: Session | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (start_time: number, end_time: number) => void
}

export function EditSessionDialog({
    session,
    open,
    onOpenChange,
    onSave,
}: EditSessionDialogProps) {
    const [start, setStart] = useState("00:00:00")
    const [end, setEnd] = useState("00:00:00")

    // Sync inputs whenever a new session is opened.
    useEffect(() => {
        if (!session || !open) return
        setStart(toTimeValue(session.start_time))
        setEnd(toTimeValue(session.end_time ?? session.start_time))
    }, [session, open])

    const referenceTs = session?.start_time ?? Date.now()
    const startTs = fromTimeValue(start, referenceTs)
    const sameDayEndTs = fromTimeValue(end, referenceTs)

    // If end is before start, assume it wrapped past midnight.
    const rollsOver = sameDayEndTs < startTs
    const endTs = rollsOver ? sameDayEndTs + DAY_MS : sameDayEndTs

    const durationMs = endTs - startTs
    const isInvalid = durationMs <= 0

    const handleSave = () => {
        if (isInvalid || !session) return
        onSave(startTs, endTs)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit session</DialogTitle>
                    <DialogDescription>
                        Adjust the start and end times for this session.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-start">Start time</Label>
                        <Input
                            id="edit-start"
                            type="time"
                            step={1}
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-end" className="justify-between">
                            <span>End time</span>
                            {rollsOver && (
                                <Badge variant="secondary">Ends next day</Badge>
                            )}
                        </Label>
                        <Input
                            id="edit-end"
                            type="time"
                            step={1}
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {isInvalid ? (
                            <span className="text-destructive">
                                End time must be after start time.
                            </span>
                        ) : (
                            <>
                                Duration:{" "}
                                <span className="font-mono tabular-nums">
                                    {formatDuration(durationMs)}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isInvalid}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}