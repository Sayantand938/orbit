import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type FormFieldConfig } from '@/config/pages';

interface DateTimeValues {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM (24-hour)
}

function buildISO(date: string, time: string): string {
    if (!date || !time) return '';
    return `${date}T${time}:00.000Z`;
}

function getCurrentDateTime(): DateTimeValues {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
    };
}

function parseISODateTime(isoString?: string): DateTimeValues | null {
    if (!isoString) return null;
    try {
        const date = new Date(isoString);
        const pad = (n: number) => String(n).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`,
        };
    } catch {
        return null;
    }
}

export function FormFields({
    fields,
    errors = {},
    initialValues,
}: {
    fields: readonly FormFieldConfig[];
    errors?: Record<string, string>;
    initialValues?: Record<string, string>;
}) {
    // State for datetime values per field
    const [datetimeValues, setDatetimeValues] = useState<Record<string, DateTimeValues>>(() => {
        const initial: Record<string, DateTimeValues> = {};
        for (const field of fields) {
            if (field.type === 'datetime-local') {
                const initVal = initialValues?.[field.name];
                if (initVal) {
                    const parsed = parseISODateTime(initVal);
                    if (parsed) {
                        initial[field.name] = parsed;
                        continue;
                    }
                }
                initial[field.name] = field.autoFill ? getCurrentDateTime() : { date: '', time: '' };
            }
        }
        return initial;
    });

    // If initialValues changes (e.g., when editing), update datetime state accordingly.
    // We only depend on initialValues and the list of field names (stable).
    useEffect(() => {
        for (const field of fields) {
            if (field.type === 'datetime-local') {
                const initVal = initialValues?.[field.name];
                if (initVal) {
                    const parsed = parseISODateTime(initVal);
                    if (parsed) {
                        setDatetimeValues((prev) => ({
                            ...prev,
                            [field.name]: parsed,
                        }));
                    }
                } else {
                    setDatetimeValues((prev) => ({
                        ...prev,
                        [field.name]: field.autoFill ? getCurrentDateTime() : { date: '', time: '' },
                    }));
                }
            }
        }
        // ✅ we intentionally omit `fields` from dependencies because it's stable,
        // and we only need to react to initialValues changes.
        // If you prefer to keep it, it's safe, but this avoids unnecessary re-runs.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    const updateDateTime = (fieldName: string, part: 'date' | 'time', value: string) => {
        setDatetimeValues((prev) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                [part]: value,
            },
        }));
    };

    return (
        <>
            {fields.map((field) => {
                const error = errors[field.name];
                let defaultValue = field.defaultValue;
                if (initialValues && field.name in initialValues) {
                    defaultValue = initialValues[field.name];
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
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                                    <Label htmlFor={`${field.name}-date`} className="sr-only">Date</Label>
                                    <Input
                                        id={`${field.name}-date`}
                                        type="text"
                                        placeholder="YYYY-MM-DD"
                                        value={datetimeValues[field.name]?.date || ''}
                                        onChange={(e) => updateDateTime(field.name, 'date', e.target.value)}
                                        className="flex-1"
                                        required={field.required}
                                    />
                                </div>
                                <div className="flex items-center gap-1 flex-1 min-w-[100px]">
                                    <Label htmlFor={`${field.name}-time`} className="sr-only">Time</Label>
                                    <Input
                                        id={`${field.name}-time`}
                                        type="text"
                                        placeholder="HH:MM"
                                        value={datetimeValues[field.name]?.time || ''}
                                        onChange={(e) => updateDateTime(field.name, 'time', e.target.value)}
                                        className="flex-1"
                                        required={field.required}
                                    />
                                </div>
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
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                );
            })}
        </>
    );
}