export type FormFieldType = 'text' | 'number' | 'select' | 'datetime-local';

export interface FormFieldConfig {
    name: string;
    label: string;
    type: FormFieldType;
    required?: boolean;
    placeholder?: string;
    defaultValue?: string;
    options?: { value: string; label: string }[];
    hint?: string;
    autoFill?: boolean;
}

export interface PageConfig<T> {
    title: string;
    singularTitle?: string;
    dateFilterKey: keyof T;
    searchPlaceholder: string;
    formFields: readonly FormFieldConfig[];
    columns: readonly {
        header: string;
        accessor: keyof T | ((item: T) => React.ReactNode);
    }[];
    transform: (formData: FormData) => Omit<T, 'id'>;
}

// Helper to create common fields
export function commonFields(
    categoryOptions: { value: string; label: string }[],
    extraFields: FormFieldConfig[] = []
): FormFieldConfig[] {
    const base: FormFieldConfig[] = [
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: true,
            placeholder: 'e.g. Description',
        },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            placeholder: 'Select a category',
            options: categoryOptions,
        },
        {
            name: 'tags',
            label: 'Tags (comma separated)',
            type: 'text',
            placeholder: 'e.g. tag1, tag2',
        },
    ];
    return [...base, ...extraFields];
}

// Options for creating a transform function
type TransformOptions<T> = {
    fieldMap: Record<keyof Omit<T, 'id'>, string>; // property -> form field name
    dateField?: keyof Omit<T, 'id'>;               // if empty, set to now
    numberFields?: (keyof Omit<T, 'id'>)[];        // properties to parse as float
};

export function createTransform<T extends { id: string | number }>(
    options: TransformOptions<T>
): (formData: FormData) => Omit<T, 'id'> {
    const { fieldMap, dateField, numberFields = [] } = options;
    return (formData: FormData): Omit<T, 'id'> => {
        const result: Record<string, any> = {};
        for (const [prop, fieldName] of Object.entries(fieldMap)) {
            const value = formData.get(fieldName as string);
            if (numberFields.includes(prop as keyof Omit<T, 'id'>)) {
                // Only parse if the value is a string; otherwise keep undefined
                result[prop] = typeof value === 'string' ? parseFloat(value) : undefined;
            } else {
                // For non-number fields, convert null to empty string
                result[prop] = value ?? '';
            }
        }
        // Set default date if the date field is missing
        if (dateField) {
            const dateKey = dateField as string;
            if (!result[dateKey]) {
                result[dateKey] = new Date().toISOString();
            }
        }
        return result as Omit<T, 'id'>;
    };
}