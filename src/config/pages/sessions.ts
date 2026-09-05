import { formatIST, formatDuration } from '@/lib/time';
import { type Session } from '@/data/types';
import { type FormFieldConfig, type PageConfig, commonFields, createTransform } from './types';

const categoryOptions = [
  { value: 'Work', label: 'Work' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Study', label: 'Study' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Other', label: 'Other' },
];

const extraFields: FormFieldConfig[] = [
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
    hint: 'Leave empty if not yet ended.',
  },
];

export const sessionsConfig: PageConfig<Session> = {
  title: 'Sessions',
  singularTitle: 'Session',
  dateFilterKey: 'startTime',
  searchPlaceholder: 'Search sessions...',
  formFields: commonFields(categoryOptions, extraFields),
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
  transform: createTransform<Session>({
    fieldMap: {
      description: 'description',
      category: 'category',
      tags: 'tags',
      startTime: 'startTime',
      endTime: 'endTime',
    },
    dateField: 'startTime',
  }),
};