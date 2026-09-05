import { createDataPage } from '@/components/createDataPage';
import { pageConfigs } from '@/config/pages';
import {
    useTransactions,
    useAddTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
} from '@/hooks/useTransactions';
import { transactionFormSchema } from '@/lib/validation';

export const Transactions = createDataPage({
    config: pageConfigs.transactions,
    schema: transactionFormSchema,
    useList: useTransactions,
    useAdd: useAddTransaction,
    useUpdate: useUpdateTransaction,
    useDelete: useDeleteTransaction,
});