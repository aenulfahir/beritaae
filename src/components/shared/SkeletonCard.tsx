import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

export function SkeletonFeatured() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

export function SkeletonSmallCard() {
    return (
        <div className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    );
}
