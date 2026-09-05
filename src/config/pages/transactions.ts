import { formatIST } from '@/lib/time'
import { type Transaction } from '@/data/types'
import { type PageConfig } from './types'

export const transactionsConfig = {
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
            type: 'select',
            required: true,
            placeholder: 'Select a category',
            options: [
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
            ],
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
            autoFill: true,
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
} satisfies PageConfig<Transaction>