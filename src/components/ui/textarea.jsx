import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
export const Textarea = forwardRef(({ className, ...props }, ref) => <textarea ref={ref} className={cn('min-h-28 w-full resize-y rounded-xl border border-border bg-white px-3.5 py-3 text-sm outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10', className)} {...props}/>)
Textarea.displayName='Textarea'
