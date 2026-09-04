import { FormFields } from './FormFields'
import { Button } from '@/components/ui/button'
import { type PageConfig } from '@/config/pages'

interface DataPageFormProps<T> {
    config: PageConfig<T>
    onSubmit: (data: Omit<T, 'id'>) => void
    onCancel: () => void
}

export function DataPageForm<T>({
    config,
    onSubmit,
    onCancel,
}: DataPageFormProps<T>) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = config.transform(formData)
        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormFields fields={config.formFields} />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    )
}