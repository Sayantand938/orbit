import { useEffect, useRef, useState } from "react"
import { Peer, type DataConnection } from "peerjs"
import { Check, Loader2, RefreshCw, Wifi } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTimerStore, type Session } from "@/store/timer"
import { mergeSessions } from "@/lib/data-transfer"
import { cn } from "@/lib/utils"

interface SyncDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type SyncRole = "host" | "client"
type SyncStatus = "idle" | "connecting" | "syncing" | "success" | "error"

type SyncMessage =
    | { type: "OFFER_SESSIONS"; sessions: Session[] }
    | { type: "ANSWER_SESSIONS"; sessions: Session[] }

function generatePin() {
    return String(Math.floor(100000 + Math.random() * 900000))
}

export function SyncDialog({ open, onOpenChange }: SyncDialogProps) {
    const sessions = useTimerStore((s) => s.sessions)
    const replaceAll = useTimerStore((s) => s.replaceAll)

    const [role, setRole] = useState<SyncRole>("host")
    const [pin, setPin] = useState(generatePin)
    const [inputPin, setInputPin] = useState("")
    const [status, setStatus] = useState<SyncStatus>("idle")
    const [statusText, setStatusText] = useState("")

    const peerRef = useRef<Peer | null>(null)
    const connRef = useRef<DataConnection | null>(null)

    // Clean up peer connections when modal closes
    const cleanup = () => {
        connRef.current?.close()
        peerRef.current?.destroy()
        connRef.current = null
        peerRef.current = null
    }

    // Initialize Host mode
    const startHost = (hostPin: string) => {
        cleanup()
        setStatus("connecting")
        setStatusText("Waiting for other device on local Wi-Fi...")

        const peerId = `orbit-sync-${hostPin}`
        const peer = new Peer(peerId)
        peerRef.current = peer

        peer.on("open", () => {
            setStatus("idle")
        })

        peer.on("connection", (conn) => {
            connRef.current = conn
            setStatus("syncing")
            setStatusText("Connected! Exchanging sessions...")

            conn.on("data", (data) => {
                const msg = data as SyncMessage
                if (msg.type === "OFFER_SESSIONS") {
                    // Merge incoming sessions from phone
                    const result = mergeSessions(sessions, msg.sessions, "merge")
                    replaceAll(result.sessions)

                    // Reply back with our sessions so phone gets them too
                    conn.send({
                        type: "ANSWER_SESSIONS",
                        sessions: result.sessions,
                    } satisfies SyncMessage)

                    setStatus("success")
                    setStatusText(
                        `Sync complete! Added ${result.added} new sessions.`
                    )
                }
            })
        })

        peer.on("error", (err) => {
            console.error("Peer error:", err)
            setStatus("error")
            setStatusText("Connection error. Please try generating a new PIN.")
        })
    }

    // Initialize Client mode (Join)
    const connectToHost = () => {
        const cleanPin = inputPin.replace(/\D/g, "")
        if (cleanPin.length !== 6) {
            setStatus("error")
            setStatusText("Please enter a valid 6-digit PIN.")
            return
        }

        cleanup()
        setStatus("connecting")
        setStatusText("Connecting to other device...")

        const peer = new Peer()
        peerRef.current = peer

        peer.on("open", () => {
            const targetId = `orbit-sync-${cleanPin}`
            const conn = peer.connect(targetId)
            connRef.current = conn

            conn.on("open", () => {
                setStatus("syncing")
                setStatusText("Connected! Sending sessions...")

                // Send local sessions to host
                conn.send({
                    type: "OFFER_SESSIONS",
                    sessions,
                } satisfies SyncMessage)
            })

            conn.on("data", (data) => {
                const msg = data as SyncMessage
                if (msg.type === "ANSWER_SESSIONS") {
                    // Apply merged result back to client
                    const result = mergeSessions(sessions, msg.sessions, "merge")
                    replaceAll(result.sessions)

                    setStatus("success")
                    setStatusText(
                        `Sync complete! Added ${result.added} new sessions.`
                    )
                }
            })

            conn.on("error", (err) => {
                console.error("Connection error:", err)
                setStatus("error")
                setStatusText("Could not find device. Ensure PIN is correct.")
            })
        })

        peer.on("error", (err) => {
            console.error("Peer error:", err)
            setStatus("error")
            setStatusText("Connection failed. Ensure both devices are online.")
        })
    }

    // Reset when dialog opens/closes or role toggles
    useEffect(() => {
        if (!open) {
            cleanup()
            setStatus("idle")
            setStatusText("")
            return
        }

        if (role === "host") {
            const newPin = generatePin()
            setPin(newPin)
            startHost(newPin)
        } else {
            cleanup()
            setStatus("idle")
            setStatusText("")
        }

        return () => cleanup()
    }, [open, role])

    const handleNewPin = () => {
        const newPin = generatePin()
        setPin(newPin)
        startHost(newPin)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wifi className="size-4 text-primary" />
                        Local Wi-Fi Sync
                    </DialogTitle>
                    <DialogDescription>
                        Direct peer-to-peer sync between devices on the same network. No data leaves your room.
                    </DialogDescription>
                </DialogHeader>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 rounded-lg border border-border bg-muted/40 p-1">
                    <button
                        type="button"
                        onClick={() => setRole("host")}
                        className={cn(
                            "rounded-md py-1.5 text-xs font-medium transition-all",
                            role === "host"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Share from this device
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("client")}
                        className={cn(
                            "rounded-md py-1.5 text-xs font-medium transition-all",
                            role === "client"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Enter code from other device
                    </button>
                </div>

                <div className="py-2">
                    {role === "host" ? (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <p className="text-xs text-muted-foreground">
                                Enter this 6-digit PIN on your other device:
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="rounded-xl border border-border bg-muted/50 px-6 py-3 font-martian text-3xl font-semibold tracking-widest tabular-nums text-foreground">
                                    {pin.slice(0, 3)} {pin.slice(3)}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleNewPin}
                                    title="Generate new PIN"
                                    className="size-9"
                                >
                                    <RefreshCw className="size-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                </span>
                                <span>Listening on local Wi-Fi...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 py-4">
                            <label
                                htmlFor="sync-pin"
                                className="text-xs font-medium text-muted-foreground"
                            >
                                6-Digit Sync PIN
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="sync-pin"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="e.g. 482915"
                                    value={inputPin}
                                    onChange={(e) => setInputPin(e.target.value)}
                                    className="font-mono text-center text-lg tracking-widest"
                                />
                                <Button
                                    onClick={connectToHost}
                                    disabled={
                                        status === "connecting" ||
                                        status === "syncing"
                                    }
                                >
                                    Connect
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Status feedback message */}
                    {statusText && (
                        <div
                            className={cn(
                                "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                                status === "success" &&
                                "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                                status === "error" &&
                                "border-destructive/30 bg-destructive/10 text-destructive",
                                (status === "connecting" || status === "syncing") &&
                                "border-border bg-muted/40 text-muted-foreground"
                            )}
                        >
                            {status === "syncing" || status === "connecting" ? (
                                <Loader2 className="size-3.5 animate-spin shrink-0" />
                            ) : status === "success" ? (
                                <Check className="size-3.5 shrink-0" />
                            ) : null}
                            <span>{statusText}</span>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}