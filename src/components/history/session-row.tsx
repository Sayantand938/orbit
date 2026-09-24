import { useState } from "react"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SessionSummary } from "@/components/history/session-summary"
import { formatClock } from "@/lib/format"
import type { SessionSlice } from "@/store/timer"
import { cn } from "@/lib/utils"

interface SessionRowProps {
    slice: SessionSlice
    index: number
    onEdit: (slice: SessionSlice) => void
    onDelete: (id: string) => void
}

export function SessionRow({
    slice,
    index,
    onEdit,
    onDelete,
}: SessionRowProps) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const { session } = slice
    const sessionEnd = session.end_time ?? session.start_time

    return (
        <li
            className={cn(
                "group/row relative rounded-xl border border-border bg-card p-3.5 shadow-xs transition-colors hover:border-border/80 sm:p-4",
                slice.live && "border-primary/50 bg-primary/[0.03]"
            )}
        >
            <SessionSummary
                index={index}
                start_time={slice.start_time}
                end_time={slice.end_time}
                running={slice.live}
                continuedFromPreviousDay={slice.continuesFromPreviousDay}
                continuesToNextDay={slice.continuesToNextDay}
                actions={
                    !slice.live && (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            title="Session actions"
                                            className="opacity-100 transition-opacity sm:opacity-0 sm:group-hover/row:opacity-100 sm:focus-visible:opacity-100 data-popup-open:opacity-100"
                                        >
                                            <MoreVertical className="size-4" />
                                        </Button>
                                    }
                                />
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => onEdit(slice)}
                                    >
                                        <Pencil className="size-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() =>
                                            setConfirmOpen(true)
                                        }
                                    >
                                        <Trash2 className="size-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialog
                                open={confirmOpen}
                                onOpenChange={setConfirmOpen}
                            >
                                <AlertDialogContent size="sm">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Delete session?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently remove{" "}
                                            <span className="font-mono tabular-nums">
                                                {formatClock(
                                                    session.start_time
                                                )}
                                            </span>
                                            {" → "}
                                            <span className="font-mono tabular-nums">
                                                {formatClock(sessionEnd)}
                                            </span>{" "}
                                            from your history. Any slice
                                            shown on other days will be
                                            removed too.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            variant="destructive"
                                            onClick={() =>
                                                onDelete(session.id)
                                            }
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )
                }
            />
        </li>
    )
}