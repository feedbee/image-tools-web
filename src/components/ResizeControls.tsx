import { Lock, Unlock } from 'lucide-react'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

interface ResizeControlsProps {
    width: number
    height: number
    onChange: (width: number, height: number) => void
    disabled?: boolean
}

export function ResizeControls({ width, height, onChange, disabled }: ResizeControlsProps) {
    const [aspectRatio, setAspectRatio] = useState<number | null>(width / height)
    const [locked, setLocked] = useState(true)

    // Update aspect ratio when dimensions change externally (e.g. initial load or crop change)
    useEffect(() => {
        if (!locked) return // If unlocked, don't update aspect ratio from outside
        setAspectRatio(width / height)
    }, [width, height, locked]) // Add relevant dependencies

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Math.max(1, parseInt(e.target.value) || 0)
        if (locked && aspectRatio) {
            onChange(newWidth, Math.round(newWidth / aspectRatio))
        } else {
            onChange(newWidth, height)
        }
    }

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = Math.max(1, parseInt(e.target.value) || 0)
        if (locked && aspectRatio) {
            onChange(Math.round(newHeight * aspectRatio), newHeight)
        } else {
            onChange(width, newHeight)
        }
    }

    const toggleLock = () => {
        if (!locked) {
            setAspectRatio(width / height)
        }
        setLocked(!locked)
    }

    return (
        <div className={clsx("flex flex-col gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800", disabled && "opacity-50 pointer-events-none")}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Resize</h3>
                <button
                    onClick={toggleLock}
                    className={clsx(
                        "p-1.5 rounded-md transition-colors",
                        locked ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    )}
                    title={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
                >
                    {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Width</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={width}
                            onChange={handleWidthChange}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-8 appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">px</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Height</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={height}
                            onChange={handleHeightChange}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-8 appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">px</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
