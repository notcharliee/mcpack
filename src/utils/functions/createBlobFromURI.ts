export default function createBlobFromURI(dataURI: string) {
  const type = dataURI.split(":")[1]?.split(";")[0]
  const binary = atob(dataURI.split(",")[1]!),
    array = []
  for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i))
  return new Blob([new Uint8Array(array)], { type: type })
}
