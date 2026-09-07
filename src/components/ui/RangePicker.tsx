import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface RangePickerProps {
    range: DateRange | undefined
    setRange: (range: DateRange | undefined) => void
}

export function RangePicker({ range, setRange }: RangePickerProps) {
    const [open, setOpen] = useState(false)

    const label = range?.from
        ? range?.to
            ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
            : format(range.from, "MMM d, yyyy")
        : "Select range"

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button variant="outline" size="sm" className="gap-2">
                        <CalendarIcon className="size-4" />
                        {label}
                    </Button>
                }
            />
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="range"
                    selected={range}
                    onSelect={(newRange) => {
                        setRange(newRange)
                        if (newRange?.from && newRange?.to) {
                            setOpen(false)
                        }
                    }}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    )
}