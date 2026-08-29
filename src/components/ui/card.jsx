import { cn } from '@/lib/utils'
export const Card = ({ className, ...p }) => <div className={cn('rounded-2xl border border-border/80 bg-white shadow-sm', className)} {...p}/>
export const CardHeader = ({ className, ...p }) => <div className={cn('p-5 pb-3', className)} {...p}/>
export const CardContent = ({ className, ...p }) => <div className={cn('p-5 pt-2', className)} {...p}/>
export const CardTitle = ({ className, ...p }) => <h3 className={cn('font-semibold text-body-dark', className)} {...p}/>
export const CardDescription = ({ className, ...p }) => <p className={cn('text-sm text-muted', className)} {...p}/>
