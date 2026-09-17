import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { formatShortDate, isSameDay } from "@/lib/format"

interface DatePickerProps {
    date: Date
    onChange: (date: Date) => void
}

export function DatePicker({ date, onChange }: DatePickerProps) {
    const [open, setOpen] = useState(false)
    const isToday = isSameDay(Date.now(), date)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        className="justify-start gap-2 font-normal"
                    >
                        <CalendarIcon className="size-4 text-muted-foreground" />
                        {isToday ? "Today" : formatShortDate(date)}
                    </Button>
                }
            />
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                        if (d) {
                            onChange(d)
                            setOpen(false)
                        }
                    }}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    )
}