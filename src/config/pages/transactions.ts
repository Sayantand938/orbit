import { formatIST } from '@/lib/time';
import { type Transaction } from '@/data/types';
import { type FormFieldConfig, type PageConfig, commonFields, createTransform } from './types';

const categoryOptions = [
    { value: 'Food & Drink', label: 'Food & Drink' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Rent / Mortgage', label: 'Rent / Mortgage' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Groceries', label: 'Groceries' },
    { value: 'Dining Out', label: 'Dining Out' },
    { value: 'Coffee', label: 'Coffee' },
    { value: 'Alcohol & Bars', label: 'Alcohol & Bars' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Home Improvement', label: 'Home Improvement' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Subscriptions', label: 'Subscriptions' },
    { value: 'Gifts', label: 'Gifts' },
    { value: 'Other', label: 'Other' },
];

const extraFields: FormFieldConfig[] = [
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
        hint: 'Pre‑filled with current time – you can change it.',
        autoFill: true,
    },
];

export const transactionsConfig: PageConfig<Transaction> = {
    title: 'Transactions',
    singularTitle: 'Transaction',
    dateFilterKey: 'event_time',
    searchPlaceholder: 'Search transactions...',
    formFields: commonFields(categoryOptions, extraFields),
    columns: [
        { header: 'Description', accessor: 'description' },
        { header: 'Amount (₹)', accessor: 'amount' },
        { header: 'Category', accessor: 'category' },
        { header: 'Location', accessor: 'location' },
        { header: 'Tags', accessor: 'tags' },
        {
            header: 'Event Time',
            accessor: (item: Transaction) => (item.event_time ? formatIST(item.event_time) : 'N/A'),
        },
    ],
    transform: createTransform<Transaction>({
        fieldMap: {
            description: 'description',
            amount: 'amount',
            category: 'category',
            location: 'location',
            tags: 'tags',
            event_time: 'event_time',
        },
        dateField: 'event_time',
        numberFields: ['amount'],
    }),
};