import { Card, CardContent } from "@/components/ui/card"
import { SessionRow } from "@/components/history/session-row"
import type { SessionSlice } from "@/store/timer"

interface SessionListProps {
    slices: SessionSlice[]
    onEdit: (slice: SessionSlice) => void
    onDelete: (id: string) => void
}

export function SessionList({ slices, onEdit, onDelete }: SessionListProps) {
    if (slices.length === 0) {
        return (
            <Card>
                <CardContent>
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No sessions on this day.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="relative">
            <span
                aria-hidden
                className="absolute top-4 bottom-4 left-[17px] w-px bg-border"
            />
            <ul className="flex list-none flex-col p-0">
                {slices.map((slice, i) => (
                    <SessionRow
                        key={`${slice.session.id}:${slice.start_time}`}
                        slice={slice}
                        index={i + 1}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    )
}