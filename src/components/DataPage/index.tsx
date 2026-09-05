import { useState } from 'react'
import { Clipboard, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { getISODatePartsInIST } from '@/lib/time'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DataFilter } from './DataFilter'
import { DataTable } from './DataTable'
import { DataActionButton } from './DataActionButton'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'

interface DataPageProps<T> {
    title: string
    singularTitle?: string
    data: T[]
    columns: readonly {
        header: string
        accessor: keyof T | ((item: T, index: number) => React.ReactNode)
    }[]
    renderForm: (
        onSubmit: (newItem: Omit<T, 'id'>) => void,
        closeDialog: () => void,
        initialData?: Omit<T, 'id'>
    ) => React.ReactNode
    onAdd: (newItem: Omit<T, 'id'>) => void
    onUpdate: (id: string | number, updates: Omit<T, 'id'>) => void
    onDelete: (id: string | number) => void
    searchPlaceholder?: string
    dateFilterKey?: keyof T
}

export function DataPage<T extends { id: string | number }>({
    title,
    singularTitle,
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

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<T | null>(null)

    // Copy feedback state
    const [copied, setCopied] = useState(false)

    // Filter data (search + date)
    const filteredData = data.filter((item) => {
        const searchMatch = JSON.stringify(item)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        if (!searchMatch) return false

        if (dateFilterKey) {
            const dateField = item[dateFilterKey]
            if (!dateField) return false

            const { year, month, day } = getISODatePartsInIST(dateField as string)
            const isSameDay =
                year === selectedDate.getFullYear() &&
                month === selectedDate.getMonth() &&
                day === selectedDate.getDate()
            return isSameDay
        }

        return true
    })

    // Prepend serial number column
    const displayColumns = [
        { header: 'SL', accessor: (_item: T, index: number) => index + 1 },
        ...columns,
    ] as const

    // Handlers
    const handleEdit = (item: T) => {
        setEditingItem(item)
        setOpen(true)
    }

    const handleDeleteClick = (item: T) => {
        setItemToDelete(item)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            onDelete(itemToDelete.id)
            setItemToDelete(null)
            setDeleteDialogOpen(false)
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

    const handleAddClick = () => {
        setEditingItem(null)
        setOpen(true)
    }

    // Copy filtered data as JSON
    const handleCopyJson = async () => {
        try {
            const json = JSON.stringify(filteredData, null, 2)
            await navigator.clipboard.writeText(json)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    // Determine singular title for dialog
    const dialogTitle = singularTitle || (title.endsWith('s') ? title.slice(0, -1) : title)

    return (
        <div className="p-6 space-y-4 h-full flex flex-col">
            <h1 className="text-2xl font-bold">{title}</h1>

            {/* Toolbar: filter + copy button */}
            <div className="flex items-center gap-2">
                <DataFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder={searchPlaceholder}
                    dateFilterKey={dateFilterKey as string}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    datePickerOpen={datePickerOpen}
                    onDatePickerOpenChange={setDatePickerOpen}
                />

                {/* Icon-only Copy JSON button with tooltip */}
                <Tooltip>
                    <TooltipTrigger render={
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={handleCopyJson}
                            className="shrink-0"
                        >
                            {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
                            <span className="sr-only">Copy table as JSON</span>
                        </Button>
                    } />
                    <TooltipContent side="bottom">
                        {copied ? 'Copied!' : 'Copy JSON'}
                    </TooltipContent>
                </Tooltip>
            </div>

            <DataTable
                data={filteredData}
                displayColumns={displayColumns}
                onEdit={handleEdit}
                onDeleteClick={handleDeleteClick}
            />

            <DataActionButton onClick={handleAddClick} />

            {/* Add/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? `Edit ${dialogTitle}` : `Add New ${dialogTitle}`}
                        </DialogTitle>
                    </DialogHeader>
                    {renderForm(
                        handleFormSubmit,
                        closeDialog,
                        editingItem ? (() => {
                            const { id, ...rest } = editingItem
                            return rest
                        })() : undefined
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}