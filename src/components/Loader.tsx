import { Loader2 } from 'lucide-react'

export function Loader() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex flex-col items-center gap-4 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <div className="space-y-1 text-center">
                    <p className="text-lg font-semibold text-zinc-100">Processing Image...</p>
                    <p className="text-sm text-zinc-400">This may take a moment for large images.</p>
                </div>
            </div>
        </div>
    )
}
