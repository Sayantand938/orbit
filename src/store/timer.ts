import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { STORAGE_KEYS } from "@/lib/config"
import { dexieStorage } from "@/lib/dexie-storage"
import { DAY_MS } from "@/lib/format"

export type Session = {
    id: string
    start_time: number
    end_time: number | null
}

export type SessionSlice = {
    session: Session
    start_time: number
    end_time: number
    live: boolean
    continuesFromPreviousDay: boolean
    continuesToNextDay: boolean
}

export type DailyTotal = {
    date: Date
    ms: number
    sessions: number
}

// --- Session helpers ---------------------------------------------------------

export function isRunning(session: Session) {
    return session.end_time === null
}

export function hasRunning(sessions: Session[]) {
    return sessions.some(isRunning)
}

export function getRunningSession(sessions: Session[]) {
    return sessions.find(isRunning) ?? null
}

export function sessionDuration(session: Session, now: number) {
    const end = session.end_time ?? now
    return Math.max(0, end - session.start_time)
}

export function sumDuration(sessions: Session[], now: number) {
    return sessions.reduce((acc, s) => acc + sessionDuration(s, now), 0)
}

// --- Day slicing -------------------------------------------------------------

function getDayBounds(date: Date) {
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayStartMs = dayStart.getTime()
    return { dayStartMs, dayEndMs: dayStartMs + DAY_MS }
}

export function sliceSessionOn(
    session: Session,
    date: Date,
    now: number
): SessionSlice | null {
    const { dayStartMs, dayEndMs } = getDayBounds(date)

    const rawEnd = session.end_time ?? now
    const sliceStart = Math.max(session.start_time, dayStartMs)
    const sliceEnd = Math.min(rawEnd, dayEndMs)
    if (sliceEnd <= sliceStart) return null

    return {
        session,
        start_time: sliceStart,
        end_time: sliceEnd,
        live: session.end_time === null && rawEnd === sliceEnd,
        continuesFromPreviousDay: session.start_time < dayStartMs,
        continuesToNextDay: rawEnd > dayEndMs,
    }
}

export function sliceSessionsOn(
    sessions: Session[],
    date: Date,
    now: number
): SessionSlice[] {
    const slices: SessionSlice[] = []
    for (const s of sessions) {
        const slice = sliceSessionOn(s, date, now)
        if (slice) slices.push(slice)
    }
    slices.sort((a, b) => a.start_time - b.start_time)
    return slices
}

export function sumSliceDuration(slices: SessionSlice[]) {
    return slices.reduce((acc, s) => acc + (s.end_time - s.start_time), 0)
}

export function hourlyBreakdown(slices: SessionSlice[]): number[] {
    const hours = new Array(24).fill(0) as number[]

    for (const slice of slices) {
        let cursor = slice.start_time
        while (cursor < slice.end_time) {
            const hourStart = new Date(cursor)
            hourStart.setMinutes(0, 0, 0)
            const hourEnd = hourStart.getTime() + 60 * 60 * 1000
            const end = Math.min(slice.end_time, hourEnd)
            hours[hourStart.getHours()] += end - cursor
            cursor = end
        }
    }

    return hours
}

// --- Daily totals ------------------------------------------------------------

function dayKey(d: Date) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function dailyTotals(sessions: Session[], now: number): DailyTotal[] {
    if (sessions.length === 0) return []

    const first = new Date(Math.min(...sessions.map((s) => s.start_time)))
    first.setHours(0, 0, 0, 0)
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)

    const byKey = new Map<string, DailyTotal>()
    const seed = new Date(first)
    while (seed <= today) {
        const date = new Date(seed)
        date.setHours(0, 0, 0, 0)
        byKey.set(dayKey(date), { date, ms: 0, sessions: 0 })
        seed.setDate(seed.getDate() + 1)
    }

    for (const s of sessions) {
        const rawEnd = s.end_time ?? now
        let cursor = new Date(s.start_time)
        cursor.setHours(0, 0, 0, 0)

        while (cursor.getTime() < rawEnd) {
            const dayStart = cursor.getTime()
            const dayEnd = dayStart + DAY_MS
            const sliceStart = Math.max(s.start_time, dayStart)
            const sliceEnd = Math.min(rawEnd, dayEnd)

            if (sliceEnd > sliceStart) {
                const entry = byKey.get(dayKey(cursor))
                if (entry) {
                    entry.ms += sliceEnd - sliceStart
                    entry.sessions += 1
                }
            }

            cursor = new Date(dayStart + DAY_MS)
        }
    }

    return [...byKey.values()].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
    )
}

// --- Store -------------------------------------------------------------------

type TimerState = {
    sessions: Session[]
    start: () => void
    stop: () => void
    discard: () => void
    updateSession: (id: string, start_time: number, end_time: number) => void
    deleteSession: (id: string) => void
    replaceAll: (sessions: Session[]) => void
    reset: () => void
}

export const useTimerStore = create<TimerState>()(
    persist(
        (set, get) => ({
            sessions: [],

            start: () => {
                const { sessions } = get()
                if (hasRunning(sessions)) return

                set({
                    sessions: [
                        ...sessions,
                        {
                            id: crypto.randomUUID(),
                            start_time: Date.now(),
                            end_time: null,
                        },
                    ],
                })
            },

            stop: () => {
                const { sessions } = get()
                const now = Date.now()
                set({
                    sessions: sessions.map((s) =>
                        isRunning(s) ? { ...s, end_time: now } : s
                    ),
                })
            },

            discard: () => {
                const { sessions } = get()
                set({
                    sessions: sessions.filter((s) => !isRunning(s)),
                })
            },

            updateSession: (id, start_time, end_time) => {
                if (end_time <= start_time) return

                set((state) => ({
                    sessions: state.sessions.map((s) =>
                        s.id === id ? { ...s, start_time, end_time } : s
                    ),
                }))
            },

            deleteSession: (id) => {
                set((state) => ({
                    sessions: state.sessions.filter((s) => s.id !== id),
                }))
            },

            replaceAll: (sessions) => set({ sessions }),

            reset: () => set({ sessions: [] }),
        }),
        {
            name: STORAGE_KEYS.TIMER,
            storage: createJSONStorage(() => dexieStorage),
            // Hydration is async (IndexedDB). We skip auto-hydration and
            // rehydrate explicitly in main.tsx before first render.
            skipHydration: true,
        }
    )
)