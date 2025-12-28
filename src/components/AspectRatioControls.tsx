import { useState, useRef } from 'react'



interface AspectRatioControlsProps {
    onRatioSelect: (ratio: number) => void
}

const PRESETS = [
    { label: '1:1', value: 1, w: 1, h: 1 },
    { label: '4:3', value: 4 / 3, w: 4, h: 3 },
    { label: '3:4', value: 3 / 4, w: 3, h: 4 },
    { label: '16:9', value: 16 / 9, w: 16, h: 9 },
    { label: '9:16', value: 9 / 16, w: 9, h: 16 },
    { label: '3:2', value: 3 / 2, w: 3, h: 2 },
]

export function AspectRatioControls({ onRatioSelect }: AspectRatioControlsProps) {
    const [customW, setCustomW] = useState('')
    const [customH, setCustomH] = useState('')
    const debouncedRatioRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const applyRatio = (w: number, h: number) => {
        if (w > 0 && h > 0) {
            onRatioSelect(w / h)
        }
    }

    // Handle Input Changes with Debounce
    const handleInputChange = (wStr: string, hStr: string) => {
        setCustomW(wStr)
        setCustomH(hStr)

        // Clear existing timer
        if (debouncedRatioRef.current) {
            clearTimeout(debouncedRatioRef.current)
        }

        // Set new timer
        debouncedRatioRef.current = setTimeout(() => {
            const w = parseFloat(wStr)
            const h = parseFloat(hStr)
            if (w > 0 && h > 0) {
                applyRatio(w, h)
            }
        }, 500)
    }

    // Handle Blur (Immediate application)
    const handleBlur = () => {
        const w = parseFloat(customW)
        const h = parseFloat(customH)
        if (w > 0 && h > 0) {
            // Clear timer to avoid double application
            if (debouncedRatioRef.current) {
                clearTimeout(debouncedRatioRef.current)
            }
            applyRatio(w, h)
        }
    }

    const handlePresetClick = (preset: typeof PRESETS[0]) => {
        setCustomW(preset.w.toString())
        setCustomH(preset.h.toString())
        onRatioSelect(preset.value)
    }

    return (
        <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Aspect Ratio</h3>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.label}
                        onClick={() => handlePresetClick(preset)}
                        className="px-2 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors border border-zinc-700 hover:border-zinc-600"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Custom */}
            <div className="space-y-2">
                <label className="text-xs text-zinc-500">Custom Ratio</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="W"
                        value={customW}
                        onChange={(e) => handleInputChange(e.target.value, customH)}
                        onBlur={handleBlur}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-zinc-500">:</span>
                    <input
                        type="number"
                        placeholder="H"
                        value={customH}
                        onChange={(e) => handleInputChange(customW, e.target.value)}
                        onBlur={handleBlur}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    )
}

