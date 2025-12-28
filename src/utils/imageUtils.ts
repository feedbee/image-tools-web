export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    format: 'image/jpeg' | 'image/png' = 'image/png'
): Promise<string | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to the final desired crop size
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // translate canvas context to draw the image relative to the crop area
    ctx.translate(-pixelCrop.x, -pixelCrop.y)
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            if (file) {
                resolve(URL.createObjectURL(file))
            } else {
                resolve(null)
            }
        }, format)
    })
}

export async function resizeImage(
    imageSrc: string,
    width: number,
    height: number,
    format: 'image/jpeg' | 'image/png' = 'image/jpeg',
    quality = 0.9
): Promise<string> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Could not get canvas context')

    ctx.drawImage(image, 0, 0, width, height)

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) throw new Error('Canvas is empty')
                resolve(URL.createObjectURL(blob))
            },
            format,
            quality
        )
    })
}
