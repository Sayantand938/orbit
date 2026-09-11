import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TagListProps {
    tags: string[] | null | undefined
    className?: string
    /** Optional cap. Tags beyond this collapse into a "+N" badge. */
    max?: number
}

export function TagList({ tags, className, max }: TagListProps) {
    const list = tags ?? []

    if (list.length === 0) {
        return <span className="text-muted-foreground">—</span>
    }

    const visible = max !== undefined ? list.slice(0, max) : list
    const hiddenCount = max !== undefined ? Math.max(0, list.length - max) : 0

    return (
        <div className={cn('flex flex-wrap gap-1', className)}>
            {visible.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                </Badge>
            ))}
            {hiddenCount > 0 && (
                <Badge variant="outline" className="text-xs">
                    +{hiddenCount}
                </Badge>
            )}
        </div>
    )
}