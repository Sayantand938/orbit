import { useEffect } from 'react'
import { DataPage } from '@/components/DataPage'
import { DataPageForm } from '@/components/DataPageForm'
import { pageConfigs } from '@/config/pages'
import { useLogStore } from '@/stores/useLogStore'
import { logFormSchema } from '@/lib/validation'
import { Spinner } from '@/components/ui/spinner'   // 👈 import

export function Logs() {
    const { items, loading, error, fetchItems, addItem, updateItem, deleteItem } = useLogStore()
    const config = pageConfigs.logs

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
                    schema={logFormSchema}
                    onSubmit={onSubmit}
                    onCancel={close}
                    initialData={initialData}
                />
            )}
        />
    )
}