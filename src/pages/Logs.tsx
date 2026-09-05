import { DataPage } from '@/components/DataPage';
import { DataPageForm } from '@/components/DataPageForm';
import { pageConfigs } from '@/config/pages';
import { useLogStore } from '@/stores/useLogStore';
import { logFormSchema } from '@/lib/validation';

export function Logs() {
    const items = useLogStore((state) => state.items);
    const addItem = useLogStore((state) => state.addItem);
    const updateItem = useLogStore((state) => state.updateItem);
    const deleteItem = useLogStore((state) => state.deleteItem);
    const config = pageConfigs.logs;

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
    );
}