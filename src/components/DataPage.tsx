import { useState } from 'react'
import { format } from 'date-fns'
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
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Plus, MoreVertical, Pencil, Trash2, CalendarIcon } from 'lucide-react'

interface DataPageProps<T> {
    title: string
    data: T[]
    columns: readonly {
        header: string
        accessor: keyof T | ((item: T) => React.ReactNode)
    }[]
    renderForm: (
        onSubmit: (newItem: Omit<T, 'id'>) => void,
        closeDialog: () => void,
        initialData?: Omit<T, 'id'>  // <-- added for editing
    ) => React.ReactNode
    onAdd: (newItem: Omit<T, 'id'>) => void
    onUpdate: (id: string | number, updates: Omit<T, 'id'>) => void   // <-- new
    onDelete: (id: string | number) => void                           // <-- new
    searchPlaceholder?: string
    dateFilterKey?: keyof T
}

export function DataPage<T extends { id: string | number }>({
    title,
    data,
    columns,
    renderForm,
    onAdd,
    onUpdate,
    onDelete,
    searchPlaceholder = 'Search...',
    dateFilterKey,
}: DataPageProps<T>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<T | null>(null)

    const filteredData = data.filter((item) => {
        const searchMatch = JSON.stringify(item)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        if (!searchMatch) return false

        if (dateFilterKey) {
            const dateField = item[dateFilterKey]
            if (dateField) {
                const itemDate = new Date(dateField as string)
                const isSameDay =
                    itemDate.getFullYear() === selectedDate.getFullYear() &&
                    itemDate.getMonth() === selectedDate.getMonth() &&
                    itemDate.getDate() === selectedDate.getDate()
                if (!isSameDay) return false
            } else {
                return false
            }
        }

        return true
    })

    const handleEdit = (item: T) => {
        setEditingItem(item)
        setOpen(true)
    }

    const handleDelete = (id: string | number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDelete(id)
        }
    }

    const handleFormSubmit = (data: Omit<T, 'id'>) => {
        if (editingItem) {
            onUpdate(editingItem.id, data)
        } else {
            onAdd(data)
        }
        setOpen(false)
        setEditingItem(null)
    }

    const closeDialog = () => {
        setOpen(false)
        setEditingItem(null)
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">{title}</h1>

            <div className="flex items-center gap-2">
                <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />

                {dateFilterKey && (
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger
                            render={
                                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                                    <CalendarIcon className="size-4" />
                                    {format(selectedDate, 'PPP')}
                                </Button>
                            }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    if (date) {
                                        setSelectedDate(date)
                                        setDatePickerOpen(false)
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                )}
            </div>

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
                                    No items found for this date.
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
                                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                    <Pencil className="mr-2 size-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(item.id)}
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

            <Button
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
                size="icon"
                onClick={() => {
                    setEditingItem(null)
                    setOpen(true)
                }}
            >
                <Plus className="size-6" />
                <span className="sr-only">Quick Add</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
                        </DialogTitle>
                    </DialogHeader>
                    {renderForm(
                        handleFormSubmit,
                        closeDialog,
                        editingItem ? (() => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { id, ...rest } = editingItem
                            return rest
                        })() : undefined
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}