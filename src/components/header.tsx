import chest_open from "~/assets/audio/chest_open.ogg"
import enchant from "~/assets/audio/enchant.ogg"

import JSZip from "jszip"

import { Button } from "~/components/ui/button"

import { FormReturn } from "~/App"

export const Header = ({ form }: { form: FormReturn }) => {
  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = new Audio(enchant)
    audio.play()
    audio.remove()

    const zip = new JSZip()
    const zippedFile = event.target!.files![0]
    const unzippedFile = await zip.loadAsync(zippedFile)

    const manifestFile = unzippedFile.file("manifest.json")!
    const manifestJSON = JSON.parse(await manifestFile.async("text"))

    const { header, metadata } = manifestJSON

    const { name, description, version, min_engine_version } = header
    const { authors } = metadata

    form.setValue("general.name", name)
    form.setValue("general.description", description)
    form.setValue("general.author", authors.join(", "))

    form.setValue("export.version", version)
    form.setValue("export.engine_version", min_engine_version)
  }

  return (
    <footer className="bg-card py-6 border-b-2 text-foreground">
      <div className="flex justify-between container mx-auto">
        <div className="flex items-center gap-4 text-balance">
          <img src="/favicon.png" className="h-8 w-8" />
          <h4 className="text-3xl leading-none font-serif-heading">McPack</h4>
        </div>
        <>
          <input
            hidden
            id="import-zip"
            type="file"
            accept=".zip,.mcpack"
            onChange={onChange}
            onClick={() =>
              setTimeout(() => {
                const audio = new Audio(chest_open)
                audio.play()
                audio.remove()
              }, 150)
            }
          />
          <Button variant="default" type="button" className="py-0" asChild>
            <label htmlFor="import-zip" className="cursor-pointer">
              Import
            </label>
          </Button>
        </>
      </div>
    </footer>
  )
}
