import { z } from 'zod'

// Treat empty strings as undefined for optional datetime fields
const optionalDatetime = z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().datetime({ offset: true }).optional()
)

export const transactionFormSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.coerce.number().positive('Amount must be positive'),
    category: z.string().min(1, 'Category is required'),
    location: z.string().optional(),
    tags: z.string().optional(),
    event_time: optionalDatetime,
})

export const logFormSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    tags: z.string().optional(),
    place: z.string().optional(),
    event_time: optionalDatetime,
})

export const sessionFormSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    tags: z.string().optional(),
    startTime: optionalDatetime,
    endTime: optionalDatetime,   // ✅ optional – allows empty or missing
}).refine(
    (data) => {
        // Only validate end > start if both are provided
        if (data.startTime && data.endTime) {
            return new Date(data.endTime) > new Date(data.startTime)
        }
        return true
    },
    {
        message: 'End time must be after start time',
        path: ['endTime'],
    }
)

/**
 * Validates FormData against a Zod schema.
 * @throws ZodError if validation fails
 */
export function validateFormData(formData: FormData, schema: z.ZodSchema): void {
    const raw = Object.fromEntries(formData.entries())
    schema.parse(raw)
}