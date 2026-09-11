import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { FormFields } from './FormFields';
import { Button } from '@/components/ui/button';
import { type FormFieldConfig, type PageConfig } from '@/config/pages';

type FormValues = Record<string, any>;

interface DataPageFormProps<T> {
    config: PageConfig<T>;
    schema: z.ZodSchema;
    onSubmit: (data: Omit<T, 'id'>) => Promise<void> | void;
    onCancel: () => void;
    initialData?: Omit<T, 'id'>;
}

function computeDefaultValues(
    fields: readonly FormFieldConfig[],
    initialData?: FormValues
): FormValues {
    const defaults: FormValues = {};
    for (const field of fields) {
        const existing = initialData?.[field.name];
        if (existing !== undefined && existing !== null && existing !== '') {
            defaults[field.name] = existing;
            continue;
        }
        if (field.type === 'datetime-local' && field.autoFill) {
            defaults[field.name] = new Date().toISOString();
            continue;
        }
        if (field.defaultValue) {
            defaults[field.name] = field.defaultValue;
            continue;
        }
        defaults[field.name] = '';
    }
    return defaults;
}

export function DataPageForm<T>({
    config,
    schema,
    onSubmit,
    onCancel,
    initialData,
}: DataPageFormProps<T>) {
    const [submitError, setSubmitError] = useState<string | null>(null);

    const formInitial: FormValues | undefined = initialData
        ? config.toFormValues
            ? config.toFormValues(initialData)
            : (initialData as unknown as FormValues)
        : undefined;

    const defaultValues = computeDefaultValues(config.formFields, formInitial);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema as any),
        defaultValues,
    });

    const submit = async (values: FormValues) => {
        setSubmitError(null);
        try {
            const entity = config.transform(values);
            await onSubmit(entity);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.';
            setSubmitError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            {submitError && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <div className="flex-1">{submitError}</div>
                </div>
            )}
            <FormFields
                fields={config.formFields}
                control={control}
                errors={errors as any}
            />
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}