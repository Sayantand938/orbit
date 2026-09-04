import { formatIST } from '@/lib/time'
import { type Transaction, type Log, type Session } from '@/data/types'

export type FormFieldType = 'text' | 'number' | 'select' | 'datetime-local'

export interface FormFieldConfig {
    name: string
    label: string
    type: FormFieldType
    required?: boolean
    placeholder?: string
    defaultValue?: string
    options?: { value: string; label: string }[]
    hint?: string
    autoFill?: boolean      // 👈 new: if true and type is datetime-local, auto‑fill current time
}

export interface PageConfig<T> {
    title: string
    dateFilterKey: keyof T
    searchPlaceholder: string
    formFields: readonly FormFieldConfig[]
    columns: readonly {
        header: string
        accessor: keyof T | ((item: T) => React.ReactNode)
    }[]
    transform: (formData: FormData) => Omit<T, 'id'>
}

export const pageConfigs = {
    transactions: {
        title: 'Transactions',
        dateFilterKey: 'event_time' as keyof Transaction,
        searchPlaceholder: 'Search transactions...',
        formFields: [
            {
                name: 'description',
                label: 'Description',
                type: 'text',
                required: true,
                placeholder: 'e.g. Coffee',
            },
            {
                name: 'amount',
                label: 'Amount (₹)',
                type: 'number',
                required: true,
                placeholder: '0.00',
            },
            {
                name: 'category',
                label: 'Category',
                type: 'text',
                required: true,
                placeholder: 'Food & Drink',
            },
            {
                name: 'location',
                label: 'Location',
                type: 'text',
                placeholder: 'e.g. Starbucks Downtown',
            },
            {
                name: 'tags',
                label: 'Tags (comma separated)',
                type: 'text',
                placeholder: 'e.g. food, lunch',
            },
            {
                name: 'event_time',
                label: 'Event Time',
                type: 'datetime-local',
                hint: 'Pre‑filled with current time – you can change it.',
                autoFill: true,     // 👈 auto‑fill
            },
        ] as const,
        columns: [
            { header: 'ID', accessor: 'id' as keyof Transaction },
            { header: 'Description', accessor: 'description' as keyof Transaction },
            { header: 'Amount (₹)', accessor: 'amount' as keyof Transaction },
            { header: 'Category', accessor: 'category' as keyof Transaction },
            { header: 'Location', accessor: 'location' as keyof Transaction },
            { header: 'Tags', accessor: 'tags' as keyof Transaction },
            {
                header: 'Event Time',
                accessor: (item: Transaction) => {
                    if (!item.event_time) return 'N/A'
                    return formatIST(item.event_time)
                },
            },
        ],
        transform: (formData: FormData): Omit<Transaction, 'id'> => {
            let eventTime = formData.get('event_time') as string
            if (!eventTime) {
                eventTime = new Date().toISOString()
            }
            return {
                description: formData.get('description') as string,
                amount: parseFloat(formData.get('amount') as string),
                category: formData.get('category') as string,
                location: formData.get('location') as string,
                tags: formData.get('tags') as string,
                event_time: eventTime,
            }
        },
    } satisfies PageConfig<Transaction>,

    logs: {
        title: 'Logs',
        dateFilterKey: 'event_time' as keyof Log,
        searchPlaceholder: 'Search logs...',
        formFields: [
            {
                name: 'description',
                label: 'Description',
                type: 'text',
                required: true,
                placeholder: 'e.g. System startup',
            },
            {
                name: 'category',
                label: 'Category',
                type: 'text',
                required: true,
                placeholder: 'System',
            },
            {
                name: 'tags',
                label: 'Tags (comma separated)',
                type: 'text',
                placeholder: 'e.g. boot, init',
            },
            {
                name: 'place',
                label: 'Place',
                type: 'text',
                placeholder: 'e.g. Server Room A',
            },
            {
                name: 'event_time',
                label: 'Event Time',
                type: 'datetime-local',
                hint: 'Pre‑filled with current time – you can change it.',
                autoFill: true,
            },
        ] as const,
        columns: [
            { header: 'ID', accessor: 'id' as keyof Log },
            { header: 'Description', accessor: 'description' as keyof Log },
            { header: 'Category', accessor: 'category' as keyof Log },
            { header: 'Tags', accessor: 'tags' as keyof Log },
            { header: 'Place', accessor: 'place' as keyof Log },
            {
                header: 'Event Time',
                accessor: (item: Log) => {
                    if (!item.event_time) return 'N/A'
                    return formatIST(item.event_time)
                },
            },
        ],
        transform: (formData: FormData): Omit<Log, 'id'> => {
            let eventTime = formData.get('event_time') as string
            if (!eventTime) {
                eventTime = new Date().toISOString()
            }
            return {
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                tags: formData.get('tags') as string,
                place: formData.get('place') as string,
                event_time: eventTime,
            }
        },
    } satisfies PageConfig<Log>,

    sessions: {
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
                // no autoFill – leave blank
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
    } satisfies PageConfig<Session>,
} as const

export type PageKey = keyof typeof pageConfigs
export type PageConfigType<T> = PageConfig<T>