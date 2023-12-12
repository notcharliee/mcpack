import createManifest from "@/utils/functions/createManifest"
import createPNG from "@/utils/functions/createPNG"
import createZip from "@/utils/functions/createZip"

const downloadPack = async ({
  name,
  description,
  author,
  icon,
  type,
  blockTextures,
  musicDiscs,
}: {
  name: string
  description: string
  author: string
  icon: string
  type: "zip" | "mcpack"
  blockTextures: {
    name?: string | undefined
    oldTexture?: string | undefined
    newTexture?: string | undefined
  }[]
  musicDiscs: {
    name?: string | undefined
    audio?: File | undefined
  }[]
}) => {
  const manifest = createManifest({ name, description, author })
  const packIcon = await createPNG(icon, true)

  const newBlockTextures = blockTextures
    .filter((blockTexture) =>
      Object.values(blockTexture).every((val) => val !== undefined),
    )
    .map(async (blockTexture) => {
      return {
        path: `textures/blocks/${blockTexture.name}.png`,
        data: await createPNG(blockTexture.newTexture!, true),
      }
    })

  const newMusicDiscs = musicDiscs
    .filter((musicDiscs) =>
      Object.values(musicDiscs).every((val) => val !== undefined),
    )
    .map((musicDiscs) => {
      return {
        path: `sounds/music/game/records/${musicDiscs.name}.ogg`,
        data: musicDiscs.audio!,
      }
    })

  const blob = await createZip(
    { path: "manifest.json", data: manifest },
    { path: "pack_icon.png", data: packIcon },
    ...(await Promise.all(newBlockTextures)),
    ...newMusicDiscs,
  )

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = `${name.replaceAll(" ", "-")}.${type}`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export default downloadPack
