import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type FormFieldConfig } from '@/config/pages'

export function FormFields({
    fields,
}: {
    fields: readonly FormFieldConfig[]
}) {
    // Store datetime components for each datetime field
    const [datetimeValues, setDatetimeValues] = useState<Record<string, { date: string; time: string }>>(() => {
        const initial: Record<string, { date: string; time: string }> = {}
        for (const field of fields) {
            if (field.type === 'datetime-local') {
                const now = field.autoFill ? new Date() : undefined
                initial[field.name] = {
                    date: now ? now.toISOString().split('T')[0] : '',
                    time: now ? now.toTimeString().slice(0, 5) : '',
                }
            }
        }
        return initial
    })

    // Build ISO string from date and time
    const buildISO = (dateStr: string, timeStr: string): string => {
        if (!dateStr || !timeStr) return ''
        return `${dateStr}T${timeStr}:00.000Z`
    }

    return (
        <>
            {fields.map((field) => {
                let defaultValue = field.defaultValue
                if (field.autoFill && field.type === 'datetime-local') {
                    defaultValue = new Date().toISOString()
                }

                return (
                    <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && ' *'}
                        </Label>

                        {field.type === 'select' ? (
                            <select
                                id={field.name}
                                name={field.name}
                                className="w-full rounded-md border border-input bg-background p-2 text-sm"
                                required={field.required}
                                defaultValue={defaultValue}
                            >
                                {field.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === 'datetime-local' ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    value={datetimeValues[field.name]?.date || ''}
                                    onChange={(e) => {
                                        const newDate = e.target.value
                                        setDatetimeValues((prev) => ({
                                            ...prev,
                                            [field.name]: {
                                                ...prev[field.name],
                                                date: newDate,
                                            },
                                        }))
                                    }}
                                    className="flex-1"
                                    required={field.required}
                                />
                                <Input
                                    type="time"
                                    value={datetimeValues[field.name]?.time || ''}
                                    onChange={(e) => {
                                        const newTime = e.target.value
                                        setDatetimeValues((prev) => ({
                                            ...prev,
                                            [field.name]: {
                                                ...prev[field.name],
                                                time: newTime,
                                            },
                                        }))
                                    }}
                                    className="w-28"
                                    required={field.required}
                                />
                                {/* Hidden input to store the combined ISO string */}
                                <input
                                    type="hidden"
                                    name={field.name}
                                    value={buildISO(
                                        datetimeValues[field.name]?.date || '',
                                        datetimeValues[field.name]?.time || ''
                                    )}
                                />
                            </div>
                        ) : (
                            <Input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                required={field.required}
                                defaultValue={defaultValue}
                            />
                        )}

                        {field.hint && <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>}
                    </div>
                )
            })}
        </>
    )
}