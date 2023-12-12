export default function (file: File): Promise<string> {
  return new Promise((resolve) => {
    const fileReader = new FileReader()

    fileReader.onload = function (data) {
      const dataURI = data.target?.result?.toString()!
      resolve(dataURI)
    }

    fileReader.readAsDataURL(file)
  })
}
