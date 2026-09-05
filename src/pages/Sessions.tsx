import { DataPage } from '@/components/DataPage'
import { DataPageForm } from '@/components/DataPageForm'
import { pageConfigs } from '@/config/pages'
import { useSessions, useAddSession, useUpdateSession, useDeleteSession } from '@/hooks/useSessions'
import { sessionFormSchema } from '@/lib/validation'
import { Spinner } from '@/components/ui/spinner'

export function Sessions() {
    const config = pageConfigs.sessions

    const { data: items = [], isLoading, error } = useSessions()
    const addMutation = useAddSession()
    const updateMutation = useUpdateSession()
    const deleteMutation = useDeleteSession()

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
            dateFieldKey="startTime"
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