import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

type Column<T> = {
    header: string
    accessor: keyof T | ((item: T, index: number) => React.ReactNode)
}

interface DataCardPreviewProps<T> {
    item: T | null
    columns: readonly Column<T>[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onEdit: (item: T) => void
    onDeleteClick: (item: T) => void
}

function renderValue<T>(col: Column<T>, item: T): React.ReactNode {
    if (typeof col.accessor === 'function') {
        return col.accessor(item, 0)
    }
    return item[col.accessor] as React.ReactNode
}

export function DataCardPreview<T extends { id: string | number }>({
    item,
    columns,
    open,
    onOpenChange,
    onEdit,
    onDeleteClick,
}: DataCardPreviewProps<T>) {
    if (!item) return null

    const meaningful = columns.filter((c) => c.header !== 'SL')
    const [primary, ...rest] = meaningful

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 p-0">
                <SheetHeader className="border-b">
                    <SheetTitle className="pr-8 text-left">
                        {renderValue(primary, item)}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-auto p-4">
                    <dl className="space-y-4">
                        {rest.map((col) => (
                            <div key={col.header} className="space-y-1">
                                <dt className="text-xs font-medium text-muted-foreground">
                                    {col.header}
                                </dt>
                                <dd className="break-words text-sm">
                                    {renderValue(col, item)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="flex gap-2 border-t p-4">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                            onOpenChange(false)
                            onEdit(item)
                        }}
                    >
                        <Pencil className="mr-2 size-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                            onOpenChange(false)
                            onDeleteClick(item)
                        }}
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}