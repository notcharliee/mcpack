import JSZip from "jszip"

interface InputByType {
  base64: string
  string: string
  text: string
  binarystring: string
  array: number[]
  uint8array: Uint8Array
  arraybuffer: ArrayBuffer
  blob: Blob
  stream: NodeJS.ReadableStream
}

export default function createZip<T extends JSZip.InputType>(
  ...files: {
    path: string
    data: InputByType[T] | Promise<InputByType[T]>
    options?: JSZip.JSZipFileOptions | undefined
  }[]
): Promise<Blob> {
  const zip = new JSZip()
  for (const file of files) zip.file(file.path, file.data, file.options)

  return zip.generateAsync({ type: "blob" })
}
