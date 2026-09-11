import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormFields } from './FormFields';
import { Button } from '@/components/ui/button';
import { type FormFieldConfig, type PageConfig } from '@/config/pages';

type FormValues = Record<string, any>;

interface DataPageFormProps<T> {
    config: PageConfig<T>;
    schema: z.ZodSchema;
    onSubmit: (data: Omit<T, 'id'>) => void;
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
    const formInitial: FormValues | undefined = initialData
        ? config.toFormValues
            ? config.toFormValues(initialData)
            : (initialData as unknown as FormValues)
        : undefined;

    const defaultValues = computeDefaultValues(config.formFields, formInitial);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema as any),
        defaultValues,
    });

    const submit = (values: FormValues) => {
        const entity = config.transform(values);
        onSubmit(entity);
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <FormFields
                fields={config.formFields}
                control={control}
                errors={errors as any}
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}