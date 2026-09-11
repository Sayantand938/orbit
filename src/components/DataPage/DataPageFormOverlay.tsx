import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DataPageFormOverlayProps<T> {
    dialogTitle: string
    editingItem: T | null
    renderForm: (
        onSubmit: (newItem: Omit<T, 'id'>) => Promise<void> | void,
        closeDialog: () => void,
        initialData?: Omit<T, 'id'>
    ) => React.ReactNode
    onSubmit: (data: Omit<T, 'id'>) => Promise<void> | void
    onClose: () => void
}

export function DataPageFormOverlay<T extends { id: string | number }>({
    dialogTitle,
    editingItem,
    renderForm,
    onSubmit,
    onClose,
}: DataPageFormOverlayProps<T>) {
    const initialData = editingItem
        ? (() => {
            const { id, ...rest } = editingItem
            return rest
        })()
        : undefined

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
            <div className="flex items-center gap-3 border-b p-4">
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClose}
                    aria-label="Go back"
                >
                    <ArrowLeft className="size-5" />
                </Button>
                <h2 className="text-xl font-semibold">
                    {editingItem ? `Edit ${dialogTitle}` : `Add New ${dialogTitle}`}
                </h2>
            </div>

            <div className="flex-1 overflow-auto scrollbar-custom p-6">
                <div className="max-w-2xl mx-auto">
                    {renderForm(onSubmit, onClose, initialData)}
                </div>
            </div>
        </div>
    )
}