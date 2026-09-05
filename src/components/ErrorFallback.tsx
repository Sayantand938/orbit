import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function ErrorFallback({
    error,
    resetErrorBoundary,
}: {
    error: unknown;
    resetErrorBoundary: () => void;
}) {
    // Safely extract error message
    const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <AlertCircle className="mb-4 size-12 text-destructive" />
            <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
            <p className="mb-4 max-w-md text-muted-foreground">{errorMessage}</p>
            <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
    );
}