import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz' // <-- Changed from utcToZonedTime

export function formatIST(utcDate: string): string {
    if (!utcDate) return 'N/A'
    // <-- Changed from utcToZonedTime
    return format(toZonedTime(new Date(utcDate), 'Asia/Kolkata'), 'yyyy-MM-dd HH:mm')
}