import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
    value?: string // ISO datetime string
    onChange: (isoString: string) => void
    required?: boolean
    autoFill?: boolean
}

export function DateTimePicker({
    value,
    onChange,
    required,
    autoFill,
}: DateTimePickerProps) {
    const initialDate = value ? new Date(value) : autoFill ? new Date() : undefined
    const [date, setDate] = useState<Date | undefined>(initialDate)
    const [time, setTime] = useState<string>(
        value ? format(new Date(value), 'HH:mm') : autoFill ? format(new Date(), 'HH:mm') : ''
    )
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (date) {
            const [hours, minutes] = time.split(':').map(Number)
            const newDate = new Date(date)
            newDate.setHours(isNaN(hours) ? 0 : hours)
            newDate.setMinutes(isNaN(minutes) ? 0 : minutes)
            onChange(newDate.toISOString())
        } else {
            onChange('')
        }
    }, [date, time, onChange])

    useEffect(() => {
        if (autoFill && !value) {
            const now = new Date()
            setDate(now)
            setTime(format(now, 'HH:mm'))
        }
    }, [autoFill, value])

    return (
        <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger
                    render={
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 size-4" />
                            {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    }
                />
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            setDate(newDate)
                            setIsOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>

            <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-28"
                required={required}
            />
        </div>
    )
}