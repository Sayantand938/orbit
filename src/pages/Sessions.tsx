import { DataPage } from '@/components/DataPage';
import { DataPageForm } from '@/components/DataPageForm';
import { pageConfigs } from '@/config/pages';
import { useSessionStore } from '@/stores/useSessionStore';
import { sessionFormSchema } from '@/lib/validation';

export function Sessions() {
    const items = useSessionStore((state) => state.items);
    const addItem = useSessionStore((state) => state.addItem);
    const config = pageConfigs.sessions;

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
                    schema={sessionFormSchema}
                    onSubmit={onSubmit}
                    onCancel={close}
                />
            )}
        />
    );
}