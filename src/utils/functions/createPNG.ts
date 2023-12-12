import createBlobFromURI from "@/utils/functions/createBlobFromURI"

export default async function createPNG<T extends boolean>(
  dataURI: string,
  blob: T,
) {
  const pngDataURI: string = await new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 256
      canvas.height = 256

      const context = canvas.getContext("2d")
      if (!context) return reject("Canvas 2D context not supported.")

      context.drawImage(img, 0, 0, 256, 256)

      try {
        const pngDataURI = canvas.toDataURL("image/png")
        resolve(pngDataURI)
      } catch (error) {
        reject(error)
      }
    }

    img.src = dataURI
  })

  return (blob ? createBlobFromURI(pngDataURI) : pngDataURI) as T extends true
    ? Blob
    : string
}
