import { useRef } from "react"
import {
  type ControllerRenderProps,
  type UseFieldArrayReturn,
  useFieldArray,
} from "react-hook-form"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card"
import {
  FormControl,
  FormField,
  FormFieldErrors,
  FormItem,
  FormLabel,
} from "~/components/ui/form"
import { SelectDisc } from "~/components/select/disc"

import { type FormValues, type FormReturn } from "~/App"

export const MusicOptions = ({ form }: { form: FormReturn }) => {
  const musicDiscArray = useFieldArray({
    control: form.control,
    name: "music",
  })

  return (
    <FormField
      control={form.control}
      name="music"
      render={({ fieldState }) => (
        <Card>
          <CardHeader>
            <CardTitle>Music Discs</CardTitle>
            <CardDescription>
              Minecraft only supports the <code>.ogg</code> audio format. If
              your music is not currently in this format, you can use{" "}
              <a href="https://audio.online-convert.com/convert-to-ogg">
                this converter.
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-10 flex-col h-full">
            <SelectDisc
              onChange={(value) =>
                musicDiscArray.append({
                  name: value,
                  file: undefined,
                })
              }
            />
            {musicDiscArray.fields.length > 0 && (
              <div className="flex flex-col gap-2 sm:gap-4">
                {musicDiscArray.fields.map((fieldArray, index) => {
                  return (
                    <FormField
                      control={form.control}
                      name={`music.${index}.file`}
                      key={fieldArray.id}
                      render={({ field }) => (
                        <MusicDiscFormItem
                          field={field}
                          musicDiscArray={musicDiscArray}
                          discName={fieldArray.name}
                          index={index}
                        />
                      )}
                    ></FormField>
                  )
                })}
              </div>
            )}
          </CardContent>
          {fieldState.error && (
            <CardFooter>
              <FormFieldErrors form={form} />
            </CardFooter>
          )}
        </Card>
      )}
    />
  )
}

const MusicDiscFormItem = ({
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
          <Button
            variant="default"
            type="button"
            className="max-sm:w-full max-sm:text-center"
            asChild
          >
            <FormLabel className="cursor-pointer">Upload Music</FormLabel>
          </Button>
        </>
      )}
    </FormItem>
  )
}
