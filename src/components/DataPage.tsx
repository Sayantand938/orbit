import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react'

interface DataPageProps<T> {
    title: string
    data: T[]
    columns: {
        header: string
        accessor: keyof T | ((item: T) => React.ReactNode)
    }[]
    renderForm: (onSubmit: (newItem: Omit<T, 'id'>) => void, closeDialog: () => void) => React.ReactNode
    onAdd: (newItem: Omit<T, 'id'>) => void
    searchPlaceholder?: string
}

export function DataPage<T extends { id: string | number }>({
    title,
    data,
    columns,
    renderForm,
    onAdd,
    searchPlaceholder = 'Search...',
}: DataPageProps<T>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [open, setOpen] = useState(false)

    const filteredData = data.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">{title}</h1>

            <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, idx) => (
                                <TableHead key={idx}>{col.header}</TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                                    No items found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    {columns.map((col, idx) => (
                                        <TableCell key={idx}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right">
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
                                                <DropdownMenuItem onClick={() => console.log('Edit', item.id)}>
                                                    <Pencil className="mr-2 size-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => console.log('Delete', item.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 size-4" />
                                                    Delete
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

            {/* Floating Action Button */}
            <Button
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
                size="icon"
                onClick={() => setOpen(true)}
            >
                <Plus className="size-6" />
                <span className="sr-only">Quick Add</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
                    </DialogHeader>
                    {renderForm(
                        (newItem) => {
                            onAdd(newItem)
                            setOpen(false)
                        },
                        () => setOpen(false)
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}