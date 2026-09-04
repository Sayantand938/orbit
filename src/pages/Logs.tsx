import { DataPage } from '@/components/DataPage'
import { DataPageForm } from '@/components/DataPageForm'
import { pageConfigs } from '@/config/pages'
import { useLogStore } from '@/stores/useLogStore'

export function Logs() {
    const items = useLogStore((state) => state.items)
    const addItem = useLogStore((state) => state.addItem)
    const config = pageConfigs.logs

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
                    onSubmit={onSubmit}
                    onCancel={close}
                />
            )}
        />
    )
}