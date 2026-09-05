import { DataPage } from '@/components/DataPage'
import { DataPageForm } from '@/components/DataPageForm'
import { pageConfigs } from '@/config/pages'
import { useLogs, useAddLog, useUpdateLog, useDeleteLog } from '@/hooks/useLogs'
import { logFormSchema } from '@/lib/validation'
import { Spinner } from '@/components/ui/spinner'

export function Logs() {
    const config = pageConfigs.logs

    const { data: items = [], isLoading, error } = useLogs()
    const addMutation = useAddLog()
    const updateMutation = useUpdateLog()
    const deleteMutation = useDeleteLog()

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
            dateFieldKey="event_time"
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