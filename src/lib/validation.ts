import { z } from 'zod';
import type { FormFieldConfig } from '@/config/pages';

export function createSchemaFromFields(fields: readonly FormFieldConfig[]) {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const field of fields) {
        let zodType: z.ZodTypeAny;

        if (field.type === 'datetime-local') {
            if (field.required) {
                zodType = z.preprocess(
                    (val) => (val === '' ? undefined : val),
                    z.string().datetime({ offset: true })
                );
            } else {
                zodType = z.preprocess(
                    (val) => (val === '' ? undefined : val),
                    z.string().datetime({ offset: true }).optional()
                );
            }
        } else if (field.type === 'number') {
            if (field.required) {
                zodType = z.coerce.number().positive(`${field.label} must be positive`);
            } else {
                zodType = z.coerce.number().optional();
            }
        } else {
            // text or select
            if (field.required) {
                zodType = z.string().min(1, `${field.label} is required`);
            } else {
                zodType = z.string().optional();
            }
        }

        shape[field.name] = zodType;
    }

    return z.object(shape);
}

// Pre-built schemas using the configs
import { transactionsConfig, logsConfig, sessionsConfig } from '@/config/pages';

export const transactionFormSchema = createSchemaFromFields(transactionsConfig.formFields);
export const logFormSchema = createSchemaFromFields(logsConfig.formFields);
export const sessionFormSchema = createSchemaFromFields(sessionsConfig.formFields).refine(
    (data) => {
        // Only validate if both start and end are provided
        if (data.startTime && data.endTime) {
            const start = new Date(data.startTime as string);
            const end = new Date(data.endTime as string);
            return end > start;
        }
        return true;
    },
    {
        message: 'End time must be after start time',
        path: ['endTime'],
    }
);

export function validateFormData(formData: FormData, schema: z.ZodSchema): void {
    const raw = Object.fromEntries(formData.entries());
    schema.parse(raw);
}