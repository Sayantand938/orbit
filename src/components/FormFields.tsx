import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type FormFieldConfig } from '@/config/pages'
import { getLocalDateTimeInput } from '@/lib/time'

export function FormFields({
    fields,
}: {
    fields: readonly FormFieldConfig[]
}) {
    return (
        <>
            {fields.map((field) => {
                // Determine default value: if autoFill and type is datetime-local, use current time
                let defaultValue = field.defaultValue
                if (field.autoFill && field.type === 'datetime-local') {
                    defaultValue = getLocalDateTimeInput()
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