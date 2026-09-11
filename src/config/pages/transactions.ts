import { formatIST } from '@/lib/time';
import { parseTags, tagsToInput } from '@/lib/utils';
import { type Transaction } from '@/data/types';
import {
    transactionCategoryOptions,
    transactionTypeOptions,
} from '@/config/options';
import { type FormFieldConfig, type PageConfig, commonFields } from './types';

const extraFields: FormFieldConfig[] = [
    {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        options: transactionTypeOptions,
    },
    {
        name: 'amount',
        label: 'Amount (₹)',
        type: 'number',
        required: true,
        placeholder: '0.00',
    },
    {
        name: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'e.g. Starbucks Downtown',
    },
    {
        name: 'event_time',
        label: 'Event Time',
        type: 'datetime-local',
        hint: 'Pre-filled with current time – you can change it.',
        autoFill: true,
    },
];

export const transactionsConfig: PageConfig<Transaction> = {
    title: 'Transactions',
    singularTitle: 'Transaction',
    dateFilterKey: 'event_time',
    searchPlaceholder: 'Search transactions...',
    formFields: commonFields(transactionCategoryOptions, extraFields),
    columns: [
        { header: 'Description', accessor: 'description' },
        {
            header: 'Amount (₹)',
            accessor: (item: Transaction) => {
                const amt = Number(item.amount);
                return amt < 0 ? `-₹${Math.abs(amt).toFixed(2)}` : `₹${amt.toFixed(2)}`;
            },
        },
        { header: 'Category', accessor: 'category' },
        { header: 'Location', accessor: 'location' },
        {
            header: 'Tags',
            accessor: (item: Transaction) => item.tags.join(', '),
        },
        {
            header: 'Event Time',
            accessor: (item: Transaction) =>
                item.event_time ? formatIST(item.event_time) : 'N/A',
        },
    ],
    transform: (values) => {
        const type = values.type as string;
        const rawAmount = Number(values.amount) || 0;
        const signedAmount = type === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

        return {
            description: values.description ?? '',
            amount: signedAmount,
            category: values.category ?? '',
            location: values.location ?? '',
            tags: parseTags(values.tags),
            event_time: values.event_time || new Date().toISOString(),
        };
    },
    toFormValues: (entity) => ({
        ...entity,
        amount: Math.abs(entity.amount),
        type: entity.amount < 0 ? 'expense' : 'income',
        tags: tagsToInput(entity.tags),
    }),
};