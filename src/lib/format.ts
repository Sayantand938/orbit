export const DAY_MS = 24 * 60 * 60 * 1000

export function pad(n: number, len = 2) {
    return String(n).padStart(len, "0")
}

function splitDuration(ms: number) {
    const totalSeconds = Math.floor(ms / 1000)
    return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        centiseconds: Math.floor((ms % 1000) / 10),
    }
}

export function formatDuration(ms: number) {
    const { hours, minutes, seconds } = splitDuration(ms)
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function formatClock(ts: number) {
    const d = new Date(ts)
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function formatTimeParts(ms: number) {
    const { hours, minutes, seconds, centiseconds } = splitDuration(ms)
    return {
        main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
        centiseconds: pad(centiseconds),
    }
}

export function isSameDay(ts: number, date: Date) {
    const d = new Date(ts)
    return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    )
}

export function formatShortDate(date: Date) {
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export function formatDayMonth(date: Date) {
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    })
}

export function formatWeekday(date: Date) {
    return date.toLocaleDateString(undefined, { weekday: "short" })
}

export function formatMonthYear(date: Date) {
    return date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    })
}