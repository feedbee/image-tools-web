import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { clsx } from 'clsx'

interface DropzoneProps {
    onFileSelect: (file: File) => void
}

export function Dropzone({ onFileSelect }: DropzoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.[0]) {
            onFileSelect(acceptedFiles[0])
        }
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 1
    })

    return (
        <div
            {...getRootProps()}
            className={clsx(
                "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-4 bg-zinc-900/50 hover:bg-zinc-800/50",
                isDragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 hover:border-zinc-600"
            )}
        >
            <input {...getInputProps()} />
            <div className={clsx(
                "p-4 rounded-full bg-zinc-800 transition-colors duration-200",
                isDragActive ? "text-blue-400 bg-blue-500/20" : "text-zinc-400"
            )}>
                {isDragActive ? (
                    <Upload className="w-8 h-8" />
                ) : (
                    <ImageIcon className="w-8 h-8" />
                )}
            </div>
            <div className="space-y-1">
                <p className="text-lg font-medium text-zinc-200">
                    {isDragActive ? "Drop the image here" : "Click or drag image to upload"}
                </p>
                <p className="text-sm text-zinc-500">
                    Supports JPEG and PNG
                </p>
            </div>
        </div>
    )
}
