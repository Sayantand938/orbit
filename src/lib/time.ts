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