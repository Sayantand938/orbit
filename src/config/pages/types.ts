export type FormFieldType = 'text' | 'number' | 'select' | 'datetime-local'

export interface FormFieldConfig {
    name: string
    label: string
    type: FormFieldType
    required?: boolean
    placeholder?: string
    defaultValue?: string
    options?: { value: string; label: string }[]
    hint?: string
    autoFill?: boolean
}

export interface PageConfig<T> {
    title: string
    dateFilterKey: keyof T
    searchPlaceholder: string
    formFields: readonly FormFieldConfig[]
    columns: readonly {
        header: string
        accessor: keyof T | ((item: T) => React.ReactNode)
    }[]
    transform: (formData: FormData) => Omit<T, 'id'>
}