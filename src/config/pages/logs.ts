import { formatIST } from '@/lib/time';
import { type Log } from '@/data/types';
import { type FormFieldConfig, type PageConfig, commonFields, createTransform } from './types';

const categoryOptions = [
    { value: 'System', label: 'System' },
    { value: 'Application', label: 'Application' },
    { value: 'Security', label: 'Security' },
    { value: 'Network', label: 'Network' },
    { value: 'Other', label: 'Other' },
];

const extraFields: FormFieldConfig[] = [
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
];

export const logsConfig: PageConfig<Log> = {
    title: 'Logs',
    singularTitle: 'Log',
    dateFilterKey: 'event_time',
    searchPlaceholder: 'Search logs...',
    formFields: commonFields(categoryOptions, extraFields),
    columns: [
        { header: 'Description', accessor: 'description' },
        { header: 'Category', accessor: 'category' },
        { header: 'Tags', accessor: 'tags' },
        { header: 'Place', accessor: 'place' },
        {
            header: 'Event Time',
            accessor: (item: Log) => (item.event_time ? formatIST(item.event_time) : 'N/A'),
        },
    ],
    transform: createTransform<Log>({
        fieldMap: {
            description: 'description',
            category: 'category',
            tags: 'tags',
            place: 'place',
            event_time: 'event_time',
        },
        dateField: 'event_time',
    }),
};