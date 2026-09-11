import { formatIST } from '@/lib/time';
import { parseTags, tagsToInput } from '@/lib/utils';
import { type Log } from '@/data/types';
import { logCategoryOptions } from '@/config/options';
import { type FormFieldConfig, type PageConfig, commonFields } from './types';

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
        hint: 'Pre-filled with current time – you can change it.',
        autoFill: true,
    },
];

export const logsConfig: PageConfig<Log> = {
    title: 'Logs',
    singularTitle: 'Log',
    dateFilterKey: 'event_time',
    searchPlaceholder: 'Search logs...',
    formFields: commonFields(logCategoryOptions, extraFields),
    columns: [
        { header: 'Description', accessor: 'description' },
        { header: 'Category', accessor: 'category' },
        {
            header: 'Tags',
            accessor: (item: Log) => item.tags.join(', '),
        },
        { header: 'Place', accessor: 'place' },
        {
            header: 'Event Time',
            accessor: (item: Log) => (item.event_time ? formatIST(item.event_time) : 'N/A'),
        },
    ],
    transform: (values) => ({
        description: values.description ?? '',
        category: values.category ?? '',
        tags: parseTags(values.tags),
        place: values.place ?? '',
        event_time: values.event_time || new Date().toISOString(),
    }),
    toFormValues: (entity) => ({
        ...entity,
        tags: tagsToInput(entity.tags),
    }),
};