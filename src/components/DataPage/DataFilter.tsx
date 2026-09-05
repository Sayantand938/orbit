import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface DataFilterProps {
    categoryOptions: string[]
    categoryFilter: string | null
    onCategoryChange: (value: string | null) => void
    startDate: Date | null
    onStartDateChange: (date: Date | null) => void
    endDate: Date | null
    onEndDateChange: (date: Date | null) => void
}

export function DataFilter({
    categoryOptions,
    categoryFilter,
    onCategoryChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
}: DataFilterProps) {
    const [startOpen, setStartOpen] = useState(false)
    const [endOpen, setEndOpen] = useState(false)

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Category */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select
                    value={categoryFilter || 'all'}
                    onValueChange={(value) => {
                        if (value === 'all') {
                            onCategoryChange(null)
                        } else {
                            onCategoryChange(value)
                        }
                    }}
                >
                    <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categoryOptions.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                <Popover open={startOpen} onOpenChange={setStartOpen}>
                    <PopoverTrigger
                        render={
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'h-9 w-full justify-start text-left font-normal',
                                    !startDate && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="size-4 mr-2 shrink-0" />
                                {startDate ? format(startDate, 'PPP') : 'Select date'}
                            </Button>
                        }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={startDate || undefined}
                            onSelect={(date) => {
                                onStartDateChange(date || null)
                                setStartOpen(false)
                            }}
                        />
                        {startDate && (
                            <div className="p-2 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                        onStartDateChange(null)
                                        setStartOpen(false)
                                    }}
                                >
                                    <X className="size-3 mr-1" /> Clear
                                </Button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">End Date</label>
                <Popover open={endOpen} onOpenChange={setEndOpen}>
                    <PopoverTrigger
                        render={
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'h-9 w-full justify-start text-left font-normal',
                                    !endDate && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="size-4 mr-2 shrink-0" />
                                {endDate ? format(endDate, 'PPP') : 'Select date'}
                            </Button>
                        }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate || undefined}
                            onSelect={(date) => {
                                onEndDateChange(date || null)
                                setEndOpen(false)
                            }}
                        />
                        {endDate && (
                            <div className="p-2 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                        onEndDateChange(null)
                                        setEndOpen(false)
                                    }}
                                >
                                    <X className="size-3 mr-1" /> Clear
                                </Button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}