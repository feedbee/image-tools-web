import Cropper, { type Area } from 'react-easy-crop'
import { RotateCw, ZoomIn } from 'lucide-react'



interface ImageEditorProps {
    imageSrc: string
    crop: { x: number; y: number }
    zoom: number
    rotation: number
    aspect?: number
    onCropChange: (crop: { x: number; y: number }) => void
    onZoomChange: (zoom: number) => void
    onRotationChange: (rotation: number) => void
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void
}

export function ImageEditor({
    imageSrc,
    crop,
    zoom,
    rotation,
    aspect,
    onCropChange,
    onZoomChange,
    onRotationChange,
    onCropComplete
}: ImageEditorProps) {

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="relative w-full flex-1 min-h-0 bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onZoomChange={onZoomChange}
                    onRotationChange={onRotationChange}
                    classes={{
                        containerClassName: "bg-zinc-950/50 checkerboard"
                    }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-4">
                    <ZoomIn className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <label>Zoom</label>
                            <span>{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <RotateCw className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <label>Rotation</label>
                            <span>{rotation}°</span>
                        </div>
                        <input
                            type="range"
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            onChange={(e) => onRotationChange(Number(e.target.value))}
                            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
