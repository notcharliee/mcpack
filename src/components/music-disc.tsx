import { useRef } from "react"
import { ControllerRenderProps, UseFieldArrayReturn } from "react-hook-form"
import { FormValues } from "~/App"
import { Button } from "./ui/button"
import { FormItem, FormControl, FormLabel } from "./ui/form"

export const MusicDiscFormItem = ({
  field,
  musicDiscArray,
  discName,
  index,
}: {
  field: ControllerRenderProps<FormValues, `music.${number}.file`>
  musicDiscArray: UseFieldArrayReturn<FormValues, "music", "id">
  discName: string
  index: number
}) => {
  const audioDurationElement = useRef<null | HTMLSpanElement>(null)

  const file = field.value

  const src = file && URL.createObjectURL(file)
  const audio = file && new Audio(src)

  const audioName = file?.name ?? "Unknown"

  if (audio) {
    audio.addEventListener("loadedmetadata", () => {
      const audioDuration = `${Math.floor(audio.duration / 60)}m, ${
        Math.floor(audio.duration) % 60
      }s`

      audioDurationElement.current!.textContent = audioDuration
    })
  }

  return (
    <FormItem className="bg-background border-2 p-4 w-full flex flex-col sm:flex-row gap-5 items-center justify-between">
      <div className="flex gap-4 max-sm:w-full">
        <div className="h-10 min-w-10 border-2 bg-card flex items-center relative">
          <img
            src={`https://raw.githubusercontent.com/ZtechNetwork/MCBVanillaResourcePack/master/textures/items/record_${discName}.png`}
            className="absolute left-[3px]"
            width={32}
            height={32}
          />
        </div>
        <div className="sm:flex sm:flex-col leading-tight">
          <p className="text-muted-foreground max-sm:flex max-sm:flex-col">
            File Name: <span className="text-foreground">{audioName}</span>
          </p>
          <p className="text-muted-foreground max-sm:hidden">
            File Duration:{" "}
            <span ref={audioDurationElement} className="text-foreground">
              Unknown
            </span>
          </p>
        </div>
      </div>
      {field.value ? (
        <Button
          variant="destructive"
          type="button"
          onClick={() => musicDiscArray.remove(index)}
          className="max-sm:w-full"
        >
          Remove
        </Button>
      ) : (
        <>
          <FormControl>
            <input
              disabled={field.disabled}
              name={field.name}
              onBlur={field.onBlur}
              ref={field.ref}
              hidden
              type="file"
              accept="audio/ogg"
              onChange={(event) => field.onChange(event.target!.files![0])}
            />
          </FormControl>
          <Button variant="default" type="button" className="max-sm:w-full max-sm:text-center" asChild>
            <FormLabel>Upload Music</FormLabel>
          </Button>
        </>
      )}
    </FormItem>
  )
}
