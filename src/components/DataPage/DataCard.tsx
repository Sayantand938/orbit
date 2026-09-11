import { ChevronRight } from 'lucide-react'

type Column<T> = {
    header: string
    accessor: keyof T | ((item: T, index: number) => React.ReactNode)
}

interface DataCardProps<T> {
    item: T
    index: number
    columns: readonly Column<T>[]
    onOpen: (item: T) => void
}

function renderValue<T>(col: Column<T>, item: T, index: number): React.ReactNode {
    if (typeof col.accessor === 'function') {
        return col.accessor(item, index)
    }
    return item[col.accessor] as React.ReactNode
}

export function DataCard<T extends { id: string | number }>({
    item,
    index,
    columns,
    onOpen,
}: DataCardProps<T>) {
    const slColumn = columns.find((c) => c.header === 'SL')
    const meaningful = columns.filter((c) => c.header !== 'SL')
    if (meaningful.length === 0) return null

    const sl = slColumn ? renderValue(slColumn, item, index) : null
    const [primary, secondary] = meaningful

    return (
        <button
            type="button"
            onClick={() => onOpen(item)}
            className="group flex w-full items-center gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted"
        >
            {sl !== null && (
                <span className="w-6 shrink-0 text-right text-xs font-mono tabular-nums text-muted-foreground">
                    {sl}
                </span>
            )}
            <div className="min-w-0 flex-1 space-y-1">
                <div className="truncate font-medium">
                    {renderValue(primary, item, index)}
                </div>
                {secondary && (
                    <div className="truncate text-sm text-muted-foreground">
                        {renderValue(secondary, item, index)}
                    </div>
                )}
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
    )
}