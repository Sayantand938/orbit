import { DataPage } from '@/components/DataPage';
import { DataPageForm } from '@/components/DataPageForm';
import { Spinner } from '@/components/ui/spinner';
import { type PageConfig } from '@/config/pages';
import { type ZodSchema } from 'zod';

export function createDataPage<T extends { id: string | number }>({
    config,
    schema,
    useList,
    useAdd,
    useUpdate,
    useDelete,
}: {
    config: PageConfig<T>;
    schema: ZodSchema;
    useList: () => { data: T[]; isLoading: boolean; error: Error | null };
    useAdd: () => { mutate: (item: Omit<T, 'id'>) => void };
    useUpdate: () => { mutate: (params: { id: string | number; updates: Omit<T, 'id'> }) => void };
    useDelete: () => { mutate: (id: string | number) => void };
}) {
    return function DataPageComponent() {
        const { data: items = [], isLoading, error } = useList();
        const addMutation = useAdd();
        const updateMutation = useUpdate();
        const deleteMutation = useDelete();

        if (isLoading) {
            return (
                <div className="flex h-full items-center justify-center">
                    <Spinner size="lg" />
                </div>
            );
        }

        if (error) {
            return <div className="p-6 text-destructive">Error: {error.message}</div>;
        }

        return (
            <DataPage
                title={config.title}
                singularTitle={config.singularTitle}
                data={items}
                columns={config.columns}
                onAdd={(newItem) => addMutation.mutate(newItem)}
                onUpdate={(id, updates) => updateMutation.mutate({ id, updates })}
                onDelete={(id) => deleteMutation.mutate(id)}
                dateFieldKey={config.dateFilterKey}
                renderForm={(onSubmit, close, initialData) => (
                    <DataPageForm
                        config={config}
                        schema={schema}
                        onSubmit={onSubmit}
                        onCancel={close}
                        initialData={initialData}
                    />
                )}
            />
        );
    };
}