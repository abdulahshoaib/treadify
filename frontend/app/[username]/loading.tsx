import { Skeleton } from "@/components/ui/skeleton"

export default function UserDashboardLoading() {
    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            {/* Background gradient effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/30 blur-3xl opacity-20"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/30 blur-3xl opacity-20"></div>
                <div className="absolute top-[60%] left-[40%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/30 blur-3xl opacity-20"></div>
            </div>

            {/* Header Skeleton */}
            <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-slate-800/50 backdrop-blur-xl bg-black/80 px-4 md:px-6">
                <Skeleton className="h-8 w-32" />
                <div className="ml-auto flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>

            <main className="relative z-10 flex-1 p-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-56 w-full rounded-xl" />
                        <Skeleton className="h-56 w-full rounded-xl" />
                        <Skeleton className="h-56 w-full rounded-xl" />
                    </div>
                </div>
            </main>
        </div>
    )
}
