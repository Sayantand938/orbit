import { useState } from 'react'
import { DataCard } from './DataCard'
import { DataCardPreview } from './DataCardPreview'

interface DataCardListProps<T> {
    data: T[]
    displayColumns: readonly {
        header: string
        accessor: keyof T | ((item: T, index: number) => React.ReactNode)
    }[]
    onEdit: (item: T) => void
    onDeleteClick: (item: T) => void
}

export function DataCardList<T extends { id: string | number }>({
    data,
    displayColumns,
    onEdit,
    onDeleteClick,
}: DataCardListProps<T>) {
    const [previewItem, setPreviewItem] = useState<T | null>(null)

    if (data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center rounded-md border py-12 text-center text-muted-foreground">
                No items found.
            </div>
        )
    }

    return (
        <>
            <div className="flex-1 overflow-auto scrollbar-custom">
                <div className="space-y-3 pb-2">
                    {data.map((item) => (
                        <DataCard
                            key={item.id}
                            item={item}
                            columns={displayColumns}
                            onOpen={setPreviewItem}
                        />
                    ))}
                </div>
            </div>

            <DataCardPreview
                item={previewItem}
                columns={displayColumns}
                open={previewItem !== null}
                onOpenChange={(open) => {
                    if (!open) setPreviewItem(null)
                }}
                onEdit={onEdit}
                onDeleteClick={onDeleteClick}
            />
        </>
    )
}