import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type FormFieldConfig } from '@/config/pages';

/** Split an ISO string into local date/time parts. */
function toParts(iso: string | null | undefined): { date: string; time: string } {
    if (!iso) return { date: '', time: '' };
    const d = new Date(iso);
    if (isNaN(d.getTime())) return { date: '', time: '' };
    const pad = (n: number) => String(n).padStart(2, '0');
    return {
        date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    };
}

/** Compose local date + time into an ISO string, or null if incomplete. */
function buildISO(date: string, time: string): string | null {
    if (!date || !time) return null;
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const d = new Date(year, month - 1, day, hours, minutes);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
}

interface FormFieldsProps {
    fields: readonly FormFieldConfig[];
    control: Control<any>;
    errors: Record<string, { message?: string } | undefined>;
}

export function FormFields({ fields, control, errors }: FormFieldsProps) {
    return (
        <>
            {fields.map((field) => {
                const error = errors[field.name]?.message;

                if (field.type === 'datetime-local') {
                    return (
                        <DateTimeField
                            key={field.name}
                            field={field}
                            control={control}
                            error={error}
                        />
                    );
                }

                return (
                    <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && ' *'}
                        </Label>

                        <Controller
                            name={field.name}
                            control={control}
                            render={({ field: rhf }) => {
                                if (field.type === 'select') {
                                    return (
                                        <Select
                                            value={rhf.value ?? ''}
                                            onValueChange={(val) => rhf.onChange(val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    );
                                }

                                return (
                                    <Input
                                        id={field.name}
                                        name={rhf.name}
                                        ref={rhf.ref}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={rhf.value ?? ''}
                                        onChange={(e) => rhf.onChange(e.target.value)}
                                        onBlur={rhf.onBlur}
                                    />
                                );
                            }}
                        />

                        {field.hint && (
                            <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>
                        )}
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                );
            })}
        </>
    );
}

function DateTimeField({
    field,
    control,
    error,
}: {
    field: FormFieldConfig;
    control: Control<any>;
    error?: string;
}) {
    const isEndTime = field.name === 'endTime';

    return (
        <div className="space-y-1.5">
            <Label htmlFor={`${field.name}-date`}>
                {field.label}
                {field.required && ' *'}
            </Label>

            <Controller
                name={field.name}
                control={control}
                render={({ field: rhf }) => {
                    const { date, time } = toParts(rhf.value);

                    const update = (next: { date?: string; time?: string }) => {
                        const d = next.date ?? date;
                        const t = next.time ?? time;
                        rhf.onChange(buildISO(d, t));
                    };

                    return (
                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                id={`${field.name}-date`}
                                type="text"
                                placeholder="YYYY-MM-DD"
                                value={date}
                                onChange={(e) => update({ date: e.target.value })}
                                onBlur={rhf.onBlur}
                                className="flex-1 min-w-[140px]"
                                aria-label={`${field.label} date`}
                            />
                            <Input
                                id={`${field.name}-time`}
                                type="text"
                                placeholder="HH:MM"
                                value={time}
                                onChange={(e) => update({ time: e.target.value })}
                                onBlur={rhf.onBlur}
                                className="flex-1 min-w-[100px]"
                                aria-label={`${field.label} time`}
                            />
                            {isEndTime && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rhf.onChange(new Date().toISOString())}
                                    className="shrink-0"
                                >
                                    Now
                                </Button>
                            )}
                        </div>
                    );
                }}
            />

            {field.hint && <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}