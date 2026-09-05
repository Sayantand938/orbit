import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DataActionButtonProps {
    onClick: () => void
}

export function DataActionButton({ onClick }: DataActionButtonProps) {
    return (
        <Button
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
            size="icon"
            onClick={onClick}
        >
            <Plus className="size-6" />
            <span className="sr-only">Quick Add</span>
        </Button>
    )
}