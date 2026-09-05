import { formatIST } from '@/lib/time'
import { type Log } from '@/data/types'
import { type PageConfig } from './types'

export const logsConfig = {
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
} satisfies PageConfig<Log>