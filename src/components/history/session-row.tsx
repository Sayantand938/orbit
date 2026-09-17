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
import { HISTORY } from "@/lib/config"
import { formatClock, pad } from "@/lib/format"
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
        <li className="group/row relative pl-12">
            <span
                aria-hidden
                className={cn(
                    "absolute top-1/2 left-[17px] z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-background font-mono text-sm font-medium tabular-nums ring-4 ring-background transition-colors",
                    slice.live ? "text-primary" : "text-muted-foreground/70"
                )}
            >
                {pad(index, HISTORY.SERIAL_PAD)}
            </span>
            <div className="-mr-2 rounded-md py-3 pr-2 pl-2 transition-colors group-hover/row:bg-muted/40">
                <SessionSummary
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
                                                className="opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100"
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
            </div>
        </li>
    )
}