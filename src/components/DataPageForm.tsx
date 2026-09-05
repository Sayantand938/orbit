import { useState } from 'react';
import { z } from 'zod';
import { FormFields } from './FormFields';
import { Button } from '@/components/ui/button';
import { type PageConfig } from '@/config/pages';
import { validateFormData } from '@/lib/validation';

interface DataPageFormProps<T> {
    config: PageConfig<T>;
    schema: z.ZodSchema;
    onSubmit: (data: Omit<T, 'id'>) => void;
    onCancel: () => void;
    initialData?: Omit<T, 'id'>;   // <-- new
}

export function DataPageForm<T>({
    config,
    schema,
    onSubmit,
    onCancel,
    initialData,
}: DataPageFormProps<T>) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            validateFormData(formData, schema);
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                for (const issue of error.issues) {
                    const path = issue.path[0] as string;
                    if (!fieldErrors[path]) {
                        fieldErrors[path] = issue.message;
                    }
                }
                setErrors(fieldErrors);
            }
            return;
        }

        const data = config.transform(formData);
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormFields fields={config.formFields} errors={errors} initialValues={initialData as Record<string, string> | undefined} />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}