import type { Session } from "@/store/timer"

/**
 * Bump when the on-disk shape changes so old exports can be detected
 * and migrated. Import refuses anything newer than this.
 */
export const DATA_VERSION = 1

export type OrbitExport = {
    version: number
    exportedAt: string
    sessions: Session[]
}

export function buildExport(sessions: Session[]): OrbitExport {
    return {
        version: DATA_VERSION,
        exportedAt: new Date().toISOString(),
        sessions,
    }
}

export function exportFilename() {
    const d = new Date()
    const stamp = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-")
    return `orbit-export-${stamp}.json`
}

/** Triggers a browser download of `data` as a JSON file. */
export function downloadJson(data: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

function isSession(value: unknown): value is Session {
    if (typeof value !== "object" || value === null) return false
    const s = value as Record<string, unknown>
    return (
        typeof s.id === "string" &&
        typeof s.start_time === "number" &&
        (s.end_time === null || typeof s.end_time === "number")
    )
}

export type ParseResult =
    | { ok: true; sessions: Session[]; exportedAt: string }
    | { ok: false; error: string }

export function parseImport(text: string): ParseResult {
    let parsed: unknown
    try {
        parsed = JSON.parse(text)
    } catch {
        return { ok: false, error: "File is not valid JSON." }
    }

    if (typeof parsed !== "object" || parsed === null) {
        return { ok: false, error: "File is not an Orbit export." }
    }

    const obj = parsed as Record<string, unknown>

    if (typeof obj.version !== "number") {
        return { ok: false, error: "Missing version field." }
    }
    if (obj.version > DATA_VERSION) {
        return {
            ok: false,
            error: `Export is version ${obj.version}, this app supports up to ${DATA_VERSION}.`,
        }
    }

    if (!Array.isArray(obj.sessions)) {
        return { ok: false, error: "Missing sessions array." }
    }

    const sessions: Session[] = []
    for (const raw of obj.sessions) {
        if (!isSession(raw)) {
            return { ok: false, error: "One or more sessions is malformed." }
        }
        sessions.push(raw)
    }

    return {
        ok: true,
        sessions,
        exportedAt: typeof obj.exportedAt === "string" ? obj.exportedAt : "",
    }
}

export type MergeMode = "merge" | "replace"

export type MergeResult = {
    sessions: Session[]
    added: number
    skipped: number
}

/**
 * Merge imported sessions into existing ones.
 * - "merge":   keep existing, add any imported session whose id is new
 * - "replace": discard existing, keep only imported
 *
 * In both modes, at most one running session (end_time === null) is kept.
 * Running sessions are stateful — two live timers would double-count and
 * confuse `getRunningSession`.
 */
export function mergeSessions(
    existing: Session[],
    imported: Session[],
    mode: MergeMode
): MergeResult {
    if (mode === "replace") {
        const cleaned = keepOneRunning(imported)
        return {
            sessions: cleaned.sessions,
            added: cleaned.sessions.length,
            skipped: imported.length - cleaned.sessions.length,
        }
    }

    const byId = new Map(existing.map((s) => [s.id, s]))
    const existingHasRunning = existing.some((s) => s.end_time === null)

    let runningAdded = false
    let added = 0
    let skipped = 0

    for (const s of imported) {
        if (byId.has(s.id)) {
            skipped++
            continue
        }

        if (s.end_time === null) {
            if (existingHasRunning || runningAdded) {
                skipped++
                continue
            }
            runningAdded = true
        }

        byId.set(s.id, s)
        added++
    }

    const sessions = [...byId.values()].sort(
        (a, b) => a.start_time - b.start_time
    )
    return { sessions, added, skipped }
}

/**
 * Returns the list with at most one running session. When there are
 * multiple, the earliest-started one is kept; the rest are dropped.
 */
function keepOneRunning(sessions: Session[]): {
    sessions: Session[]
} {
    const running = sessions.filter((s) => s.end_time === null)
    if (running.length <= 1) return { sessions }

    const keeper = running.reduce((a, b) =>
        a.start_time <= b.start_time ? a : b
    )
    return {
        sessions: sessions.filter(
            (s) => s.end_time !== null || s.id === keeper.id
        ),
    }
}