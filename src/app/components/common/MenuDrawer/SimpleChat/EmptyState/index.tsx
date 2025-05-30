import { Skeleton } from '@/components/ui/skeleton'

export function EmptyState() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative w-full">
        <div className="absolute -right-6 -top-20 left-0 m-auto w-fit space-y-4 rounded-2xl bg-muted px-6 py-8 shadow-md">
          <Skeleton className="h-3 w-[150px] bg-white/20" />
          <Skeleton className="h-3 w-[200px] bg-white/20" />
        </div>

        <div className="absolute -bottom-20 -left-6 right-0 m-auto w-fit space-y-4 rounded-2xl bg-slate-600 px-6 py-8 shadow-md">
          <Skeleton className="h-3 w-[150px] bg-white/20" />
          <Skeleton className="h-3 w-[200px] bg-white/20" />
        </div>
      </div>
    </div>
  )
}
