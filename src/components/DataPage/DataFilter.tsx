import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface DataFilterProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    searchPlaceholder?: string
    dateFilterKey?: string
    selectedDate: Date
    onDateChange: (date: Date) => void
    datePickerOpen: boolean
    onDatePickerOpenChange: (open: boolean) => void
}

export function DataFilter({
    searchTerm,
    onSearchChange,
    searchPlaceholder = 'Search...',
    dateFilterKey,
    selectedDate,
    onDateChange,
    datePickerOpen,
    onDatePickerOpenChange,
}: DataFilterProps) {
    return (
        <div className="flex items-center gap-2">
            <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1"
            />

            {dateFilterKey && (
                <Popover open={datePickerOpen} onOpenChange={onDatePickerOpenChange}>
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
                                    onDateChange(date)
                                    onDatePickerOpenChange(false)
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}