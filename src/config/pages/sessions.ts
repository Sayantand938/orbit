import { formatIST, formatDuration } from '@/lib/time';
import { type Session } from '@/data/types';
import { sessionCategoryOptions } from '@/config/options';
import { type FormFieldConfig, type PageConfig, commonFields } from './types';

const extraFields: FormFieldConfig[] = [
  {
    name: 'startTime',
    label: 'Start Time',
    type: 'datetime-local',
    hint: 'Pre-filled with current time – you can change it.',
    autoFill: true,
  },
  {
    name: 'endTime',
    label: 'End Time',
    type: 'datetime-local',
    hint: 'Leave empty if not yet ended.',
  },
];

export const sessionsConfig: PageConfig<Session> = {
  title: 'Sessions',
  singularTitle: 'Session',
  dateFilterKey: 'startTime',
  searchPlaceholder: 'Search sessions...',
  formFields: commonFields(sessionCategoryOptions, extraFields),
  columns: [
    { header: 'Description', accessor: 'description' },
    { header: 'Category', accessor: 'category' },
    { header: 'Tags', accessor: 'tags' },
    {
      header: 'Start Time',
      accessor: (item: Session) => (item.startTime ? formatIST(item.startTime) : 'N/A'),
    },
    {
      header: 'End Time',
      accessor: (item: Session) => (item.endTime ? formatIST(item.endTime) : 'N/A'),
    },
    {
      header: 'Duration',
      accessor: (item: Session) => formatDuration(item.startTime, item.endTime),
    },
  ],
  transform: (values) => ({
    description: values.description ?? '',
    category: values.category ?? '',
    tags: values.tags ?? '',
    startTime: values.startTime || new Date().toISOString(),
    endTime: values.endTime || null,
  }),
};