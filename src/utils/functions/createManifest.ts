import { v4 as randomUUID } from "uuid"
import packageJson from "@/../package.json"

export default function createManifest({
  name,
  description,
  author,
}: {
  name: string
  description: string
  author: string
}) {
  return JSON.stringify({
    format_version: 2,
    header: {
      description,
      min_engine_version: [1, 20, 0],
      name,
      uuid: randomUUID(),
      version: [1, 0, 0],
    },
    modules: [
      {
        description,
        type: "resources",
        uuid: randomUUID(),
        version: [1, 0, 0],
      },
    ],
    metadata: {
      authors: [author],
      generated_with: {
        "mcpack.charliee.dev": [packageJson.version],
      },
    },
  })
}
