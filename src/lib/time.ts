import { format, toZonedTime } from 'date-fns-tz'

/**
 * Formats a UTC date string to IST (Indian Standard Time) as "yyyy-MM-dd HH:mm"
 */
export function formatIST(utcDate: string): string {
    if (!utcDate) return 'N/A'
    return format(new Date(utcDate), 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Kolkata' })
}

/**
 * Returns the current local date/time in the format "YYYY-MM-DDTHH:MM"
 * Used for pre-filling datetime-local inputs.
 */
export function getLocalDateTimeInput(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Calculates and formats the duration between two ISO datetime strings.
 * Returns a string like "3h 30m", "45m", "<1m", or "—" if invalid.
 */
export function formatDuration(
    start: string | null | undefined,
    end: string | null | undefined
): string {
    if (!start || !end) return '—'
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '—'
    const diffMs = endDate.getTime() - startDate.getTime()
    if (diffMs < 0) return '—'
    const diffMinutes = Math.floor(diffMs / 60000)
    if (diffMinutes === 0) return '<1m'
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
}

/**
 * Extracts the year, month (0-based), and day from an ISO string, converted to IST.
 * Used for date filtering in the DataPage component.
 */
export function getISODatePartsInIST(isoString: string): { year: number; month: number; day: number } {
    const date = new Date(isoString)
    const istDate = toZonedTime(date, 'Asia/Kolkata')
    return {
        year: istDate.getFullYear(),
        month: istDate.getMonth(),
        day: istDate.getDate(),
    }
}