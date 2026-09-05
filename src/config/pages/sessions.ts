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
            name: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            placeholder: 'Select a category',
            options: [
                { value: 'Work', label: 'Work' },
                { value: 'Meeting', label: 'Meeting' },
                { value: 'Study', label: 'Study' },
                { value: 'Personal', label: 'Personal' },
                { value: 'Fitness', label: 'Fitness' },
                { value: 'Entertainment', label: 'Entertainment' },
                { value: 'Other', label: 'Other' },
            ],
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
            hint: 'Leave empty if not yet ended.',   // 👈 updated hint
            // no autoFill – remains empty by default
        },
    ] as const,
    columns: [
        { header: 'ID', accessor: 'id' as keyof Session },
        { header: 'Description', accessor: 'description' as keyof Session },
        { header: 'Category', accessor: 'category' as keyof Session },
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
                if (!item.endTime) return 'N/A'   // empty string → N/A
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

        // 👇 No auto‑fill: if endTime is empty, set to empty string
        if (!endTime) {
            endTime = ''
        }

        return {
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            tags: formData.get('tags') as string,
            startTime,
            endTime,
        }
    },
} satisfies PageConfig<Session>