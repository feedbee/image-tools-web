import { useState, useCallback } from 'react'
import type { Area } from 'react-easy-crop'
import { Download, Image as ImageIcon, RotateCcw } from 'lucide-react'
import { Dropzone } from './components/Dropzone'
import { ImageEditor } from './components/ImageEditor'
import { ResizeControls } from './components/ResizeControls'
import { AspectRatioControls } from './components/AspectRatioControls'
import { ConfirmDialog } from './components/ConfirmDialog'
import getCroppedImg, { resizeImage, createImage } from './utils/imageUtils'


function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [filename, setFilename] = useState<string>('image')

  // Editor State
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Resize State
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number, height: number } | null>(null)

  // UI State
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const onFileSelect = async (file: File) => {
    setFilename(file.name.replace(/\.[^/.]+$/, ""))
    const imageDataUrl = URL.createObjectURL(file)
    setImageSrc(imageDataUrl)

    // Reset state
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)

    // Get dimensions
    const img = await createImage(imageDataUrl)
    setWidth(img.width)
    setHeight(img.height)
    setOriginalDimensions({ width: img.width, height: img.height })
  }

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
    // Optional: Auto-update resize dimensions to match crop?
    // For now, let's keep resize independent (resampling) or maybe simpler:
    // If we want "Resize" to mean "Output Size", then it's fine.
  }, [])

  // When crop area changes size (e.g. zooming destroys pixel mapping?), 
  // actually croppedAreaPixels.width IS the width of the cropped region in source pixels.
  // If the user wants to CROP then RESIZE, they usually expect "I like this frame" -> "Make it 500px wide".
  // So the workflow is valid.

  const handleDownload = async (format: 'image/jpeg' | 'image/png') => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      // 1. Get the cropped image (at full resolution of the crop)
      const croppedImageSrc = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        format
      )

      if (!croppedImageSrc) return

      // 2. Resize to target dimensions
      const finalImageSrc = await resizeImage(
        croppedImageSrc,
        width,
        height,
        format
      )

      // 3. Download
      const link = document.createElement('a')
      link.href = finalImageSrc
      link.download = `${filename}-edited.${format === 'image/jpeg' ? 'jpeg' : 'png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (e) {
      console.error(e)
    }
  }

  const handleCloseClick = () => {
    setShowCloseConfirm(true)
  }

  const handleConfirmClose = () => {
    setImageSrc(null)
    setOriginalDimensions(null)
    setShowCloseConfirm(false)
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    if (originalDimensions) {
      setWidth(originalDimensions.width)
      setHeight(originalDimensions.height)
    }
  }

  const handleRatioSelect = (targetRatio: number) => {
    if (!originalDimensions) return

    const { width: origW, height: origH } = originalDimensions
    const origRatio = origW / origH

    let newW, newH

    if (origRatio > targetRatio) {
      // Image is wider than target. Fit height, reduce width.
      newH = origH
      newW = Math.round(origH * targetRatio)
    } else {
      // Image is taller than target (or equal). Fit width, reduce height.
      newW = origW
      newH = Math.round(origW / targetRatio)
    }

    setWidth(newW)
    setHeight(newH)

    // Reset crop to center to ensure better UX when switching ratios
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">ImageTools</h1>
          </div>
          {imageSrc && (
            <button
              onClick={handleCloseClick}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Close Editor
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col overflow-hidden">
        {!imageSrc ? (
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6">
            <div className="max-w-xl w-full">
              <Dropzone onFileSelect={onFileSelect} />
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full h-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
            {/* Left: Editor */}
            <div className="lg:col-span-2 h-full flex flex-col overflow-hidden">
              <ImageEditor
                imageSrc={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={width && height ? width / height : undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Right: Controls */}
            <div className="space-y-6 overflow-y-auto h-full pr-2">
              <AspectRatioControls onRatioSelect={handleRatioSelect} />

              <ResizeControls
                width={width}
                height={height}
                onChange={(w, h) => {
                  setWidth(w)
                  setHeight(h)
                }}
              />

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Changes
              </button>

              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-4">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Export</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownload('image/png')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownload('image/jpeg')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    JPEG
                  </button>
                </div>
              </div>

              {originalDimensions && (
                <div className="text-xs text-zinc-500 text-center">
                  Original size: {originalDimensions.width} x {originalDimensions.height} px
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <ConfirmDialog
        isOpen={showCloseConfirm}
        title="Close Editor?"
        message="Are you sure you want to close the editor? Any unsaved changes will be lost."
        confirmText="Close Editor"
        onConfirm={handleConfirmClose}
        onCancel={() => setShowCloseConfirm(false)}
      />
    </div>
  )
}

export default App
