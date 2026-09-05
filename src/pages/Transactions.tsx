import { DataPage } from '@/components/DataPage'
import { DataPageForm } from '@/components/DataPageForm'
import { pageConfigs } from '@/config/pages'
import { useTransactions, useAddTransaction, useUpdateTransaction, useDeleteTransaction } from '@/hooks/useTransactions'
import { transactionFormSchema } from '@/lib/validation'
import { Spinner } from '@/components/ui/spinner'

export function Transactions() {
    const config = pageConfigs.transactions

    const { data: items = [], isLoading, error } = useTransactions()
    const addMutation = useAddTransaction()
    const updateMutation = useUpdateTransaction()
    const deleteMutation = useDeleteTransaction()

    // Auto-refetch when component mounts (or query handles it)
    // No need for useEffect

    if (isLoading) return (
        <div className="flex h-full items-center justify-center">
            <Spinner size="lg" />
        </div>
    )

    if (error) return <div className="p-6 text-destructive">Error: {error.message}</div>

    return (
        <DataPage
            title={config.title}
            data={items}
            columns={config.columns}
            onAdd={(newItem) => addMutation.mutate(newItem)}
            onUpdate={(id, updates) => updateMutation.mutate({ id, updates })}
            onDelete={(id) => deleteMutation.mutate(id)}
            dateFilterKey={config.dateFilterKey}
            searchPlaceholder={config.searchPlaceholder}
            renderForm={(onSubmit, close, initialData) => (
                <DataPageForm
                    config={config}
                    schema={transactionFormSchema}
                    onSubmit={onSubmit}
                    onCancel={close}
                    initialData={initialData}
                />
            )}
        />
    )
}