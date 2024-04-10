import "~/styles/globals.css"

import pack_icon from "~/assets/pack_icon.ts"
import edit_icon from "~/assets/edit_icon.png"
import bass from "~/assets/audio/bass.ogg"
import pop from "~/assets/audio/pop.ogg"

import { useForm, useFieldArray } from "react-hook-form"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { v4 as randomUUID } from "uuid"
import JSZip from "jszip"

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormFieldErrors,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { SelectDisc } from "~/components/select/disc"
import { MusicDiscFormItem } from "~/components/music-disc"
import { Footer } from "~/components/footer"

import discs from "~/lib/discs"

import { version } from "../package.json"

const formSchema = z.object({
  general: z.object({
    name: z.string().min(1, "Name is required."),
    author: z.string().min(1, "Author is required."),
    description: z.string().min(1, "Description is required."),
    icon: z.instanceof(File),
  }),
  music: z.array(
    z.object({
      name: z.string(),
      file: z.instanceof(File).optional(),
    })
  ),
  config: z.object({
    mcpack: z.boolean(),
  }),
})

export type FormValues = z.infer<typeof formSchema>

const uriToFile = (uri: string): File => {
  const arr = uri.split(",")
  const mime = arr[0]?.match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new File([new Blob([u8arr], { type: mime })], "pack_icon")
}

export default function App() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      general: {
        name: "",
        author: "",
        description: "",
        icon: uriToFile(pack_icon),
      },
      config: {
        mcpack: false,
      },
    },
  })

  const [packIconURL, setPackIconURL] = useState(pack_icon)

  const musicDiscArray = useFieldArray({ control: form.control, name: "music" })

  const onSubmit = async (data: FormValues) => {
    new Audio(pop).play()

    const zip = new JSZip()

    zip.file(
      "manifest.json",
      JSON.stringify(
        {
          format_version: 2,
          header: {
            description: data.general.description,
            min_engine_version: [1, 20, 0],
            name: data.general.name,
            uuid: randomUUID(),
            version: [1, 0, 0],
          },
          modules: [
            {
              description: data.general.description,
              type: "resources",
              uuid: randomUUID(),
              version: [1, 0, 0],
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
      data.config.mcpack ? "mcpack" : "zip"
    }`

    document.body.appendChild(link).click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <>
      <main>
        <Form {...form}>
          <form
            className="space-y-8 sm:space-y-10 py-8 md:py-12 container mx-auto"
            onSubmit={form.handleSubmit(onSubmit, () => {
              new Audio(bass).play()
            })}
          >
            <FormField
              control={form.control}
              name="general"
              render={({ fieldState }) => (
                <Card>
                  <CardHeader>
                    <CardTitle>General Details</CardTitle>
                    <CardDescription>
                      The builder will handle generating your pack’s manifest
                      for you, but you need to give it a name, author, and
                      description first.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-4 sm:gap-8 flex-col sm:flex-row h-full">
                    <FormField
                      control={form.control}
                      name="general.icon"
                      render={({ field }) => (
                        <FormItem className="max-w-full border-2 relative grid place-items-center overflow-hidden min-w-48">
                          <img
                            src={packIconURL}
                            className="bg-center bg-cover absolute top-0 left-0 w-full h-full blur-md"
                          />
                          <img
                            src={packIconURL}
                            width={192}
                            height={192}
                            className="w-full h-full max-h-48 max-w-48 object-cover z-10"
                          />
                          <FormControl>
                            <input
                              disabled={field.disabled}
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                              hidden
                              type="file"
                              accept="image/png,image/jpeg,image/gif,image/svg+xml"
                              onChange={(event) => {
                                const file = event.target!.files![0]

                                new Promise(
                                  (resolve: (value: string) => void) => {
                                    const fileReader = new FileReader()

                                    fileReader.onload = (data) => {
                                      const img = document.createElement("img")

                                      img.onload = () => {
                                        const canvas =
                                          document.createElement("canvas")

                                        canvas.width = 256
                                        canvas.height = 256

                                        const context = canvas.getContext("2d")!

                                        context.drawImage(img, 0, 0, 256, 256)

                                        resolve(canvas.toDataURL())
                                      }

                                      img.src = data.target!.result!.toString()
                                    }

                                    fileReader.readAsDataURL(file)
                                  }
                                ).then((dataUri) => {
                                  setPackIconURL(dataUri)
                                  field.onChange(uriToFile(dataUri))
                                })
                              }}
                            />
                          </FormControl>
                          <FormLabel className="w-20 h-20 bg-background/75 border-2 border-border/50 absolute grid place-items-center cursor-pointer z-20">
                            <div
                              className="w-full h-full bg-muted-foreground hover:bg-foreground duration-200"
                              style={{
                                WebkitMaskImage: `url(${edit_icon})`,
                                maskImage: `url(${edit_icon})`,
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                                maskSize: "70%",
                              }}
                            />
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex gap-4 flex-col sm:flex-row">
                        <FormField
                          control={form.control}
                          name="general.name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  placeholder="Pack name"
                                  autoComplete="off"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="general.author"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  placeholder="Pack author"
                                  autoComplete="off"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="general.description"
                        render={({ field }) => (
                          <FormItem className="h-full">
                            <FormControl>
                              <Textarea
                                placeholder="Pack description"
                                className="h-full max-sm:min-h-[150px] resize-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  {fieldState.error && (
                    <CardFooter>
                      <FormFieldErrors form={form} />
                    </CardFooter>
                  )}
                </Card>
              )}
            />
            <FormField
              control={form.control}
              name="music"
              render={({ fieldState }) => (
                <Card>
                  <CardHeader>
                    <CardTitle>Music Discs</CardTitle>
                    <CardDescription>
                      Minecraft only supports the <code>.ogg</code> audio format. If your
                      music is not currently in this format, you can use{" "}
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
            <Card>
              <CardHeader>
                <CardTitle>Export</CardTitle>
                <CardDescription>
                  You can choose to export this as either a zip file or mcpack
                  file.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-6">
                <Button onClick={() => form.setValue("config.mcpack", false)}>
                  Export as zip
                </Button>
                <Button onClick={() => form.setValue("config.mcpack", true)}>
                  Export as mcpack
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </main>
      <Footer />
    </>
  )
}
