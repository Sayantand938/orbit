import { useState, useMemo } from 'react'
import { Clipboard, Check, Search, Filter as FilterIcon, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DataFilter } from './DataFilter'
import { DataTable } from './DataTable'
import { DataCardList } from './DataCardList'
import { DataActionButton } from './DataActionButton'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns'

interface DataPageProps<T> {
    title: string
    singularTitle?: string
    data: T[]
    columns: readonly {
        header: string
        accessor: keyof T | ((item: T, index: number) => React.ReactNode)
    }[]
    renderForm: (
        onSubmit: (newItem: Omit<T, 'id'>) => Promise<void> | void,
        closeDialog: () => void,
        initialData?: Omit<T, 'id'>
    ) => React.ReactNode
    onAdd: (newItem: Omit<T, 'id'>) => Promise<void> | void
    onUpdate: (id: string | number, updates: Omit<T, 'id'>) => Promise<void> | void
    onDelete: (id: string | number) => void
    dateFieldKey: keyof T
    categoryFieldKey?: keyof T
    searchFieldKey?: keyof T
    searchPlaceholder?: string
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
    dateFieldKey,
    categoryFieldKey = 'category' as keyof T,
    searchFieldKey = 'description' as keyof T,
    searchPlaceholder = 'Search...',
}: DataPageProps<T>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<T | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<T | null>(null)
    const [copied, setCopied] = useState(false)

    const categoryOptions = useMemo(() => {
        const cats = new Set<string>()
        data.forEach((item) => {
            const val = item[categoryFieldKey]
            if (typeof val === 'string' && val.trim() !== '') {
                cats.add(val)
            }
        })
        return Array.from(cats).sort()
    }, [data, categoryFieldKey])

    const activeFilterCount = useMemo(() => {
        let count = 0
        if (searchTerm.trim() !== '') count++
        if (categoryFilter !== null) count++
        if (startDate !== null) count++
        if (endDate !== null) count++
        return count
    }, [searchTerm, categoryFilter, startDate, endDate])

    const filteredData = data.filter((item) => {
        if (searchTerm.trim() !== '') {
            const field = item[searchFieldKey]
            if (typeof field !== 'string') return false
            if (!field.toLowerCase().includes(searchTerm.toLowerCase())) return false
        }
        if (categoryFilter && item[categoryFieldKey] !== categoryFilter) {
            return false
        }

        if (startDate || endDate) {
            const dateField = item[dateFieldKey]
            if (!dateField) return false
            let itemDate: Date
            try {
                itemDate = parseISO(dateField as string)
            } catch {
                return false
            }
            if (startDate && !endDate) {
                if (itemDate < startOfDay(startDate)) return false
            } else if (!startDate && endDate) {
                if (itemDate > endOfDay(endDate)) return false
            } else if (startDate && endDate) {
                if (!isWithinInterval(itemDate, { start: startOfDay(startDate), end: endOfDay(endDate) })) {
                    return false
                }
            }
        }
        return true
    })

    const displayColumns = [
        { header: 'SL', accessor: (_item: T, index: number) => index + 1 },
        ...columns,
    ] as const

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

    const handleFormSubmit = async (data: Omit<T, 'id'>) => {
        if (editingItem) {
            await onUpdate(editingItem.id, data)
        } else {
            await onAdd(data)
        }
        closeForm()
    }

    const closeForm = () => {
        setOpen(false)
        setEditingItem(null)
    }

    const handleAddClick = () => {
        setEditingItem(null)
        setOpen(true)
    }

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

    const handleClearFilters = () => {
        setSearchTerm('')
        setCategoryFilter(null)
        setStartDate(null)
        setEndDate(null)
    }

    const hasFilters = activeFilterCount > 0
    const dialogTitle = singularTitle || (title.endsWith('s') ? title.slice(0, -1) : title)

    if (open) {
        const initialData = editingItem
            ? (() => {
                const { id, ...rest } = editingItem
                return rest
            })()
            : undefined

        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-background">
                <div className="flex items-center gap-3 border-b p-4">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={closeForm}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="size-5" />
                    </Button>
                    <h2 className="text-xl font-semibold">
                        {editingItem ? `Edit ${dialogTitle}` : `Add New ${dialogTitle}`}
                    </h2>
                </div>

                <div className="flex-1 overflow-auto scrollbar-custom p-6">
                    <div className="max-w-2xl mx-auto">
                        {renderForm(handleFormSubmit, closeForm, initialData)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold">{title}</h1>

            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 h-9 w-full"
                        />
                    </div>

                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    onClick={handleCopyJson}
                                    className="shrink-0"
                                >
                                    {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
                                    <span className="sr-only">Copy table as JSON</span>
                                </Button>
                            }
                        />
                        <TooltipContent side="bottom">
                            {copied ? 'Copied!' : 'Copy JSON'}
                        </TooltipContent>
                    </Tooltip>

                    <CollapsibleTrigger>
                        <Button variant="ghost" size="icon-sm" className="shrink-0 relative">
                            <FilterIcon className="size-4" />
                            {hasFilters && (
                                <Badge
                                    variant="secondary"
                                    className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                            <span className="sr-only">Toggle filters</span>
                        </Button>
                    </CollapsibleTrigger>

                    {hasFilters && (
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={handleClearFilters}
                                        className="shrink-0"
                                    >
                                        <X className="size-4" />
                                        <span className="sr-only">Clear all filters</span>
                                    </Button>
                                }
                            />
                            <TooltipContent side="bottom">Clear all filters</TooltipContent>
                        </Tooltip>
                    )}
                </div>

                <CollapsibleContent>
                    <Card className="border shadow-sm mt-2">
                        <CardContent className="pt-4">
                            <DataFilter
                                categoryOptions={categoryOptions}
                                categoryFilter={categoryFilter}
                                onCategoryChange={setCategoryFilter}
                                startDate={startDate}
                                onStartDateChange={setStartDate}
                                endDate={endDate}
                                onEndDateChange={setEndDate}
                            />
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>

            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex flex-1 min-h-0 flex-col md:hidden">
                    <DataCardList
                        data={filteredData}
                        displayColumns={displayColumns}
                        onEdit={handleEdit}
                        onDeleteClick={handleDeleteClick}
                    />
                </div>
                <div className="hidden flex-1 min-h-0 md:block">
                    <DataTable
                        data={filteredData}
                        displayColumns={displayColumns}
                        onEdit={handleEdit}
                        onDeleteClick={handleDeleteClick}
                    />
                </div>
            </div>

            <DataActionButton onClick={handleAddClick} />

            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}