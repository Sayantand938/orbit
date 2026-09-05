import { useEffect } from 'react'
import { DataPage } from '@/components/DataPage'
import { DataPageForm } from '@/components/DataPageForm'
import { pageConfigs } from '@/config/pages'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { transactionFormSchema } from '@/lib/validation'
import { Spinner } from '@/components/ui/spinner'   // 👈 import

export function Transactions() {
    const { items, loading, error, fetchItems, addItem, updateItem, deleteItem } = useTransactionStore()
    const config = pageConfigs.transactions

    useEffect(() => {
        fetchItems()
    }, [])

    if (loading) return (
        <div className="flex h-full items-center justify-center">
            <Spinner size="lg" />
        </div>
    )

    if (error) return <div className="p-6 text-destructive">Error: {error}</div>

    return (
        <DataPage
            title={config.title}
            data={items}
            columns={config.columns}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
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