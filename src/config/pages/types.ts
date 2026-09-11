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
    searchFieldKey?: keyof T;
    categoryFieldKey?: keyof T;
    formFields: readonly FormFieldConfig[];
    columns: readonly {
        header: string;
        accessor: keyof T | ((item: T) => React.ReactNode);
    }[];
    /** Given validated RHF values, produce the entity shape (minus id). */
    transform: (values: Record<string, any>) => Omit<T, 'id'>;
    /** Given an existing entity, produce the form's default values. Optional. */
    toFormValues?: (entity: Omit<T, 'id'>) => Record<string, any>;
}

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