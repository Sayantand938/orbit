import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Full-screen fallback for the top-level boundary. Used when the app
 * can't render at all (theme provider, router, store init, etc.).
 */
export function AppErrorFallback({ onReset }: { onReset: () => void }) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-background p-6">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
                    <AlertTriangle className="size-8 text-destructive" />
                    <div className="flex flex-col gap-1.5">
                        <h1 className="font-heading text-lg font-medium">
                            Something went wrong
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Orbit hit an unexpected error. Reloading usually
                            fixes it.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onReset}>
                            <RotateCcw className="size-4" />
                            Try again
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            Reload
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * Inline fallback for the per-page boundary. Renders inside `<main>` so
 * the sidebar stays usable and the user can navigate away.
 */
export function PageErrorFallback({ onReset }: { onReset: () => void }) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <AlertTriangle className="size-6 text-destructive" />
                <div className="flex flex-col gap-1">
                    <p className="font-medium">This page crashed</p>
                    <p className="text-sm text-muted-foreground">
                        Try again, or use the sidebar to switch pages.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={onReset}>
                    <RotateCcw className="size-4" />
                    Try again
                </Button>
            </CardContent>
        </Card>
    )
}