import block_textures from "@/utils/block_textures"
import createURIFromFile from "@/utils/functions/createURIFromFile"

const addBlockTexture = async ({
  state,
  setState,
  name,
  texture,
}: {
  state: {
    name?: string | undefined
    oldTexture?: string | undefined
    newTexture?: string | undefined
  }[]
  setState: React.Dispatch<
    React.SetStateAction<
      {
        name?: string | undefined
        oldTexture?: string | undefined
        newTexture?: string | undefined
      }[]
    >
  >
  name?: string
  texture?: File
}) => {
  // Get the last texture added to the array
  const lastIndex = state.length - 1
  const lastTexture = state[lastIndex]
  const lastTextureComplete = !!(
    lastTexture &&
    lastTexture.name &&
    lastTexture.oldTexture &&
    lastTexture.newTexture &&
    lastTexture.oldTexture !== lastTexture.newTexture
  )

  // Get the elements
  const blockTextureSelect = document.getElementById(
    "block-texture-select",
  ) as HTMLSelectElement
  const blockTextureUpload = document.getElementById(
    "block-texture-upload",
  ) as HTMLInputElement

  // Get the new data from the parameters
  const swappedTextureName = name ?? lastTexture?.name
  const swappedTextureOldTexture =
    block_textures[swappedTextureName as keyof typeof block_textures]
  const swappedTextureNewTexture = texture
    ? await createURIFromFile(texture)
    : lastTextureComplete
      ? swappedTextureOldTexture
      : lastTexture?.newTexture == lastTexture?.oldTexture
        ? swappedTextureOldTexture
        : lastTexture?.newTexture

  // Create a new texture object with the updated stuff
  const newTextureObject = {
    name: swappedTextureName,
    oldTexture: swappedTextureOldTexture,
    newTexture: swappedTextureNewTexture,
  }

  if (!lastTexture) {
    // If the last texture doesn't exist, just add the new object
    setState([newTextureObject])

    blockTextureSelect.value = ""
    blockTextureUpload.files = null
  } else if (lastTextureComplete) {
    // But if the last texture is a complete object, add a new object after it
    setState((prevTextures) => [...prevTextures, newTextureObject])

    blockTextureSelect.value = ""
    blockTextureUpload.files = null
  } else {
    // Otherwise, swap out the last texture's object for the updated one
    setState((prevTextures) => [
      ...prevTextures.slice(0, lastIndex),
      newTextureObject,
    ])

    blockTextureSelect.value = ""
    blockTextureUpload.files = null
  }
}

export default addBlockTexture
