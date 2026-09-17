import { useRef, useState } from "react"
import {
    Download,
    Monitor,
    Moon,
    Sun,
    Trash2,
    Upload,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)

    const handleExport = () => {
        downloadJson(buildExport(sessions), exportFilename())
        setStatus(`Exported ${sessions.length} sessions.`)
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
                ? `Replaced with ${result.added} sessions.`
                : `Added ${result.added} new, skipped ${result.skipped} duplicates.`
        )
        setImportOpen(false)
        setPendingImport(null)
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-muted-foreground">
                    Customize how Orbit looks and behaves.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                        Choose how the app looks. System follows your OS
                        preference.
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:max-w-md">
                        {themeOptions.map(({ value, label, icon: Icon }) => {
                            const isActive = theme === value
                            return (
                                <Button
                                    key={value}
                                    variant="outline"
                                    onClick={() => setTheme(value)}
                                    className={cn(
                                        "h-auto flex-col gap-2 py-4",
                                        isActive &&
                                        "border-primary bg-primary/5 text-foreground hover:bg-primary/10"
                                    )}
                                >
                                    <Icon className="size-5" />
                                    <span className="text-sm font-medium">
                                        {label}
                                    </span>
                                </Button>
                            )
                        })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Tip: press{" "}
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
                            d
                        </kbd>{" "}
                        anywhere to toggle between light and dark.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Orbit stores everything locally in your browser.{" "}
                        <span className="font-mono tabular-nums">
                            {sessions.length}
                        </span>{" "}
                        recorded{" "}
                        {sessions.length === 1 ? "session" : "sessions"}.
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            disabled={sessions.length === 0}
                        >
                            <Download className="size-4" />
                            Export JSON
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="size-4" />
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

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                    {status && (
                        <p className="text-sm text-muted-foreground">{status}</p>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-fit"
                                    disabled={sessions.length === 0}
                                >
                                    <Trash2 className="size-4" />
                                    Clear all data
                                </Button>
                            }
                        />
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Clear all data?
                                </AlertDialogTitle>
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
                                        setStatus("All data cleared.")
                                    }}
                                >
                                    Clear everything
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

            <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import sessions</DialogTitle>
                        <DialogDescription>
                            Found{" "}
                            <span className="font-mono tabular-nums">
                                {pendingImport?.length ?? 0}
                            </span>{" "}
                            sessions in the file. How should they be combined
                            with your existing{" "}
                            <span className="font-mono tabular-nums">
                                {sessions.length}
                            </span>
                            ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
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
        </div>
    )
}