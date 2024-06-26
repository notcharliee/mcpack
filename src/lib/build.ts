import { version } from "~/../package.json"

import pop from "~/assets/audio/pop.ogg"

import { v4 as randomUUID } from "uuid"
import JSZip from "jszip"

import discs from "~/lib/discs"

import type { FormValues } from "~/App"

export const buildPack = async (data: FormValues) => {
  const audio = new Audio(pop)
  audio.play()
  audio.remove()

  const zip = new JSZip()

  zip.file(
    "manifest.json",
    JSON.stringify(
      {
        format_version: 2,
        header: {
          description: data.general.description,
          min_engine_version: data.export.engine_version,
          name: data.general.name,
          uuid: randomUUID(),
          version: data.export.version,
        },
        modules: [
          {
            description: data.general.description,
            type: "resources",
            uuid: randomUUID(),
            version: data.export.version,
          },
        ],
        metadata: {
          authors: [data.general.author],
          url: "https://mcpack.vercel.app/",
          generated_with: {
            mcpack: [version],
          },
        },
      },
      null,
      2
    )
  )

  zip.file("pack_icon.png", data.general.icon)

  for (const disc of data.music) {
    if (!disc.file) continue
    zip.file(discs[disc.name as keyof typeof discs].sound, disc.file)
  }

  const blob = await zip.generateAsync({ type: "blob" })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = `${data.general.name.replaceAll(" ", "-")}.${
    data.export.mcpack ? "mcpack" : "zip"
  }`

  document.body.appendChild(link).click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
