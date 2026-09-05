import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.ComponentProps<'div'> {
    size?: 'sm' | 'default' | 'lg'
}

export function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
    const sizeClasses = {
        sm: 'size-4',
        default: 'size-6',
        lg: 'size-8',
    }

    return (
        <div className={cn('flex items-center justify-center', className)} {...props}>
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        </div>
    )
}