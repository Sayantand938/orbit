import { useRef, useState } from "react"
import {
    AlertCircle,
    Check,
    Download,
    Monitor,
    Moon,
    Sun,
    Trash2,
    Upload,
    Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { SyncDialog } from "@/components/sync-dialog"
import { useTheme } from "@/components/theme-provider"
import { useTimerStore, type Session } from "@/store/timer"
import {
    buildExport,
    downloadJson,
    exportFilename,
    mergeSessions,
    parseImport,
    type MergeMode,
} from "@/lib/data-transfer"
import { cn } from "@/lib/utils"

const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
] as const

export function Settings() {
    const { theme, setTheme } = useTheme()
    const sessions = useTimerStore((s) => s.sessions)
    const reset = useTimerStore((s) => s.reset)
    const replaceAll = useTimerStore((s) => s.replaceAll)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [pendingImport, setPendingImport] = useState<Session[] | null>(null)
    const [importOpen, setImportOpen] = useState(false)
    const [syncOpen, setSyncOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)

    const handleExport = () => {
        downloadJson(buildExport(sessions), exportFilename())
        setStatus(`Exported ${sessions.length} sessions successfully.`)
        setError(null)
    }

    const handleFile = async (file: File) => {
        setError(null)
        setStatus(null)
        const text = await file.text()
        const result = parseImport(text)
        if (!result.ok) {
            setError(result.error)
            return
        }
        setPendingImport(result.sessions)
        setImportOpen(true)
    }

    const handleImport = (mode: MergeMode) => {
        if (!pendingImport) return
        const result = mergeSessions(sessions, pendingImport, mode)
        replaceAll(result.sessions)
        setStatus(
            mode === "replace"
                ? `Replaced database with ${result.added} sessions.`
                : `Added ${result.added} new sessions (${result.skipped} duplicates skipped).`
        )
        setImportOpen(false)
        setPendingImport(null)
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your preferences, data exports, and local storage.
                </p>
            </div>

            {/* Inline Feedback Alerts */}
            {status && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-xs text-foreground">
                    <Check className="size-4 shrink-0 text-emerald-500" />
                    <span>{status}</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Appearance Section */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Appearance
                </h2>
                <div className="rounded-xl border border-border bg-card">
                    <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-foreground">Theme</p>
                            <p className="text-xs text-muted-foreground">
                                Select how Orbit appears on this device.
                            </p>
                        </div>

                        {/* Segmented Pill Theme Switcher */}
                        <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-1">
                            {themeOptions.map(({ value, label, icon: Icon }) => {
                                const isActive = theme === value
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setTheme(value)}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all outline-hidden",
                                            isActive
                                                ? "bg-background text-foreground shadow-xs"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="size-3.5" />
                                        <span>{label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="border-t border-border/50 px-4 py-2.5">
                        <p className="text-[0.75rem] text-muted-foreground">
                            Tip: Press{" "}
                            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] text-foreground">
                                D
                            </kbd>{" "}
                            anywhere to quickly toggle light and dark mode.
                        </p>
                    </div>
                </div>
            </section>

            {/* Data & Storage Section */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Data & Storage
                </h2>
                <div className="divide-y divide-border/60 rounded-xl border border-border bg-card">
                    {/* Database status row */}
                    <div className="flex items-center justify-between gap-4 p-4">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Storage Status
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Local browser database (IndexedDB).
                            </p>
                        </div>
                        <span className="rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-foreground">
                            {sessions.length}{" "}
                            {sessions.length === 1 ? "session" : "sessions"}
                        </span>
                    </div>

                    {/* Local Wi-Fi Sync Row */}
                    <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Local Wi-Fi Sync
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Directly sync with PC or phone on the same network.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSyncOpen(true)}
                            className="w-fit shrink-0"
                        >
                            <Wifi className="size-3.5" />
                            Sync Devices
                        </Button>
                    </div>

                    {/* Export */}
                    <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Export Sessions
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Download your complete history as an Orbit JSON file.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            disabled={sessions.length === 0}
                            className="w-fit shrink-0"
                        >
                            <Download className="size-3.5" />
                            Export JSON
                        </Button>
                    </div>

                    {/* Import */}
                    <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Import Sessions
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Merge or restore sessions from a previous JSON backup.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-fit shrink-0"
                        >
                            <Upload className="size-3.5" />
                            Import JSON
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json,.json"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) void handleFile(file)
                                e.target.value = ""
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-destructive/80">
                    Danger Zone
                </h2>
                <div className="rounded-xl border border-destructive/25 bg-destructive/[0.02] p-4">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Clear All Data
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Permanently wipe all recorded sessions and logs from this device.
                            </p>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger
                                render={
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-fit shrink-0"
                                        disabled={sessions.length === 0}
                                    >
                                        <Trash2 className="size-3.5" />
                                        Clear data
                                    </Button>
                                }
                            />
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This permanently deletes every session from
                                        your history. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={() => {
                                            reset()
                                            setStatus("All session data has been erased.")
                                            setError(null)
                                        }}
                                    >
                                        Clear everything
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </section>

            {/* Sync Dialog Modal */}
            <SyncDialog open={syncOpen} onOpenChange={setSyncOpen} />

            {/* Import Dialog */}
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import sessions</DialogTitle>
                        <DialogDescription>
                            Found{" "}
                            <span className="font-mono font-medium tabular-nums text-foreground">
                                {pendingImport?.length ?? 0}
                            </span>{" "}
                            sessions in the file. Choose how to combine them with your
                            existing{" "}
                            <span className="font-mono font-medium tabular-nums text-foreground">
                                {sessions.length}
                            </span>
                            :
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setImportOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleImport("merge")}
                        >
                            Merge
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleImport("replace")}
                        >
                            Replace all
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Minimal App Footer */}
            <div className="flex items-center justify-center gap-2 pt-4 text-xs text-muted-foreground/60">
                <span>Orbit</span>
                <span>•</span>
                <span>Local-First</span>
                <span>•</span>
                <span>Zero Tracking</span>
            </div>
        </div>
    )
}