import { z } from 'zod';
import type { FormFieldConfig } from '@/config/pages';
import { transactionsConfig, logsConfig, sessionsConfig } from '@/config/pages';

export function createSchemaFromFields(fields: readonly FormFieldConfig[]) {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const field of fields) {
        let zodType: z.ZodTypeAny;

        if (field.type === 'datetime-local') {
            if (field.required) {
                zodType = z
                    .union([z.string(), z.null(), z.undefined()])
                    .refine((val): val is string => typeof val === 'string' && val.length > 0, {
                        message: `${field.label} is required`,
                    });
            } else {
                zodType = z
                    .union([z.string(), z.null(), z.undefined()])
                    .transform((val) => (val ? val : null));
            }
        } else if (field.type === 'number') {
            if (field.required) {
                zodType = z.preprocess(
                    (val) => (val === '' || val === null || val === undefined ? undefined : val),
                    z.coerce
                        .number()
                        .refine((n) => !isNaN(n), { message: `${field.label} must be a number` })
                );
            } else {
                zodType = z.preprocess(
                    (val) => (val === '' || val === null || val === undefined ? undefined : val),
                    z.coerce.number().optional()
                );
            }
        } else {
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

export const transactionFormSchema = createSchemaFromFields(transactionsConfig.formFields).refine(
    (data) => {
        const amount = data.amount;
        return typeof amount === 'number' && amount > 0;
    },
    {
        message: 'Amount must be a positive number',
        path: ['amount'],
    }
);

export const logFormSchema = createSchemaFromFields(logsConfig.formFields);

export const sessionFormSchema = createSchemaFromFields(sessionsConfig.formFields).refine(
    (data) => {
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