import { formatIST, formatDuration } from '@/lib/time'
import { type Session } from '@/data/types'
import { type PageConfig } from './types'

export const sessionsConfig = {
    title: 'Sessions',
    dateFilterKey: 'startTime' as keyof Session,
    searchPlaceholder: 'Search sessions...',
    formFields: [
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: true,
            placeholder: 'e.g. Development session',
        },
        {
            name: 'tags',
            label: 'Tags (comma separated)',
            type: 'text',
            placeholder: 'e.g. coding, react',
        },
        {
            name: 'startTime',
            label: 'Start Time',
            type: 'datetime-local',
            hint: 'Pre‑filled with current time – you can change it.',
            autoFill: true,
        },
        {
            name: 'endTime',
            label: 'End Time',
            type: 'datetime-local',
            hint: 'Leave blank to set 1 hour after start.',
        },
    ] as const,
    columns: [
        { header: 'ID', accessor: 'id' as keyof Session },
        { header: 'Description', accessor: 'description' as keyof Session },
        { header: 'Tags', accessor: 'tags' as keyof Session },
        {
            header: 'Start Time',
            accessor: (item: Session) => {
                if (!item.startTime) return 'N/A'
                return formatIST(item.startTime)
            },
        },
        {
            header: 'End Time',
            accessor: (item: Session) => {
                if (!item.endTime) return 'N/A'
                return formatIST(item.endTime)
            },
        },
        {
            header: 'Duration',
            accessor: (item: Session) => formatDuration(item.startTime, item.endTime),
        },
    ],
    transform: (formData: FormData): Omit<Session, 'id'> => {
        let startTime = formData.get('startTime') as string
        let endTime = formData.get('endTime') as string
        if (!startTime) {
            startTime = new Date().toISOString()
        }
        if (!endTime) {
            const end = new Date(startTime)
            end.setHours(end.getHours() + 1)
            endTime = end.toISOString()
        }
        return {
            description: formData.get('description') as string,
            tags: formData.get('tags') as string,
            startTime,
            endTime,
        }
    },
} satisfies PageConfig<Session>