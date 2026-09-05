import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function formatIST(utcDate: string): string {
    if (!utcDate) return 'N/A'
    return format(toZonedTime(new Date(utcDate), 'Asia/Kolkata'), 'yyyy-MM-dd HH:mm')
}

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
 * Returns a string like "3h 30m" or "45m" or "—" if invalid.
 */
export function formatDuration(start: string | undefined, end: string | undefined): string {
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