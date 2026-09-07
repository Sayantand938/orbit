import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface DataTableProps<T> {
    data: T[]
    displayColumns: readonly {
        header: string
        accessor: keyof T | ((item: T, index: number) => React.ReactNode)
    }[]
    onEdit: (item: T) => void
    onDeleteClick: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({
    data,
    displayColumns,
    onEdit,
    onDeleteClick,
}: DataTableProps<T>) {
    return (
        <div className="border rounded-md flex-1 overflow-auto scrollbar-custom">
            <Table className="w-full">
                <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                        {displayColumns.map((col, idx) => (
                            <TableHead key={idx} className="whitespace-nowrap">
                                {col.header}
                            </TableHead>
                        ))}
                        <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={displayColumns.length + 1} className="text-center text-muted-foreground">
                                No items found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, rowIndex) => (
                            <TableRow key={item.id}>
                                {displayColumns.map((col, colIndex) => (
                                    <TableCell key={colIndex} className="whitespace-nowrap">
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(item, rowIndex)
                                            : (item[col.accessor] as React.ReactNode)}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right whitespace-nowrap">
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
                                                <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDeleteClick(item)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="mr-2 size-4" />
                                                Delete
                                                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}