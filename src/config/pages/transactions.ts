import { formatIST } from '@/lib/time';
import { type Transaction } from '@/data/types';
import { type FormFieldConfig, type PageConfig, commonFields } from './types';

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
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        options: [
            { value: 'income', label: 'Income (Earned)' },
            { value: 'expense', label: 'Expense (Spent)' },
        ],
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
        {
            header: 'Amount (₹)',
            accessor: (item: Transaction) => {
                const amt = Number(item.amount);
                return amt < 0 ? `-₹${Math.abs(amt).toFixed(2)}` : `₹${amt.toFixed(2)}`;
            },
        },
        { header: 'Category', accessor: 'category' },
        { header: 'Location', accessor: 'location' },
        { header: 'Tags', accessor: 'tags' },
        {
            header: 'Event Time',
            accessor: (item: Transaction) => (item.event_time ? formatIST(item.event_time) : 'N/A'),
        },
    ],
    transform: (formData: FormData): Omit<Transaction, 'id'> => {
        const type = formData.get('type') as string;
        const amount = parseFloat(formData.get('amount') as string) || 0;
        const signedAmount = type === 'expense' ? -amount : amount;

        return {
            description: formData.get('description') as string || '',
            amount: signedAmount,
            category: formData.get('category') as string || '',
            location: formData.get('location') as string || '',
            tags: formData.get('tags') as string || '',
            event_time: formData.get('event_time') as string || new Date().toISOString(),
        };
    },
};