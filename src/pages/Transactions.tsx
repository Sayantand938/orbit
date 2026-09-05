import { DataPage } from '@/components/DataPage';
import { DataPageForm } from '@/components/DataPageForm';
import { pageConfigs } from '@/config/pages';
import { useTransactionStore } from '@/stores/useTransactionStore';
import { transactionFormSchema } from '@/lib/validation';

export function Transactions() {
    const items = useTransactionStore((state) => state.items);
    const addItem = useTransactionStore((state) => state.addItem);
    const config = pageConfigs.transactions;

    return (
        <DataPage
            title={config.title}
            data={items}
            columns={config.columns}
            onAdd={addItem}
            dateFilterKey={config.dateFilterKey}
            searchPlaceholder={config.searchPlaceholder}
            renderForm={(onSubmit, close) => (
                <DataPageForm
                    config={config}
                    schema={transactionFormSchema}
                    onSubmit={onSubmit}
                    onCancel={close}
                />
            )}
        />
    );
}