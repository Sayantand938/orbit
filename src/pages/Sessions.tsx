import { useEffect } from 'react'
import { DataPage } from '@/components/DataPage'
import { DataPageForm } from '@/components/DataPageForm'
import { pageConfigs } from '@/config/pages'
import { useSessionStore } from '@/stores/useSessionStore'
import { sessionFormSchema } from '@/lib/validation'
import { Spinner } from '@/components/ui/spinner'

export function Sessions() {
    const { items, loading, error, fetchItems, addItem, updateItem, deleteItem } = useSessionStore()
    const config = pageConfigs.sessions

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
                    schema={sessionFormSchema}
                    onSubmit={onSubmit}
                    onCancel={close}
                    initialData={initialData}
                />
            )}
        />
    )
}