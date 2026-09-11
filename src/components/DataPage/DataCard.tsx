import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Column<T> = {
    header: string
    accessor: keyof T | ((item: T, index: number) => React.ReactNode)
}

interface DataCardProps<T> {
    item: T
    columns: readonly Column<T>[]
    onEdit: (item: T) => void
    onDeleteClick: (item: T) => void
}

function renderValue<T>(col: Column<T>, item: T): React.ReactNode {
    if (typeof col.accessor === 'function') {
        return col.accessor(item, 0)
    }
    return item[col.accessor] as React.ReactNode
}

export function DataCard<T extends { id: string | number }>({
    item,
    columns,
    onEdit,
    onDeleteClick,
}: DataCardProps<T>) {
    // The DataPage injects an "SL" column — noise on a card, drop it.
    const meaningful = columns.filter((c) => c.header !== 'SL')
    if (meaningful.length === 0) return null

    const [primary, ...rest] = meaningful
    const secondary = rest[0]
    const details = rest.slice(1)

    return (
        <div className="rounded-lg border bg-card p-4 space-y-3">
            {/* Title row */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="font-medium truncate">
                        {renderValue(primary, item)}
                    </div>
                    {secondary && (
                        <div className="text-sm text-muted-foreground truncate">
                            {renderValue(secondary, item)}
                        </div>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="ghost" size="icon-sm">
                                <MoreVertical className="size-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        }
                    />
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDeleteClick(item)}
                            className="text-destructive"
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Detail grid */}
            {details.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3 text-sm">
                    {details.map((col) => (
                        <div key={col.header} className="min-w-0 space-y-0.5">
                            <dt className="truncate text-xs text-muted-foreground">
                                {col.header}
                            </dt>
                            <dd className="truncate">{renderValue(col, item)}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </div>
    )
}