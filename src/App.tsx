import "~/styles/globals.css"

import pack_icon from "~/assets/pack_icon.ts"
import edit_icon from "~/assets/edit_icon.png"
import particles from "~/assets/particles.png"
import bee from "~/assets/bee.png"

import pollinate1 from "~/assets/audio/pollinate1.ogg"
import pollinate2 from "~/assets/audio/pollinate2.ogg"
import bass from "~/assets/audio/bass.ogg"
import pop from "~/assets/audio/pop.ogg"

import { useForm } from "react-hook-form"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { v4 as randomUUID } from "uuid"
import JSZip from "jszip"

import { Button } from "~/components/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormFieldErrors,
} from "~/components/form"
import { Input } from "~/components/input"
import { Textarea } from "~/components/textarea"

import { version } from "../package.json"

const formSchema = z.object({
  general: z.object({
    name: z.string().min(1, "Name is required."),
    author: z.string().min(1, "Author is required."),
    description: z.string().min(1, "Description is required."),
    icon: z.instanceof(File),
  }),
  config: z.object({
    mcpack: z.boolean(),
  }),
})

export type FormValues = z.infer<typeof formSchema>

const uriToFile = (uri: string) => {
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

    // console.log(data.general.icon)

    zip.file("pack_icon.png", data.general.icon)

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
      <footer className="bg-card py-8 md:py-12 border-t-2">
        <div className="relative container mx-auto">
          <div className="flex flex-col gap-2 text-balance">
            <h4 className="text-2xl leading-none font-serif-heading text-foreground">
              Thanks for using my app!
            </h4>
            <p className="text-lg text-muted-foreground leading-tight">
              You can find more cool stuff like this on my{" "}
              <a
                href="https://charliee.dev"
                className="underline underline-offset-4"
              >
                portfolio page.
              </a>
              <br className="max-sm:hidden" />
              <span className="sm:hidden"> </span>
              If you can spare some change,{" "}
              <a
                href="https://www.buymeacoffee.com/notcharliee"
                className="underline underline-offset-4"
              >
                buy me a coffee!
              </a>
            </p>
          </div>
          <button
            className="size-[109px] absolute -top-8 right-8 rotate-12 hidden min-[700px]:block group"
            onClick={() => {
              const arr = [new Audio(pollinate1), new Audio(pollinate2)]
              const sfx = arr[Math.floor(Math.random() * arr.length)]

              sfx.play()
            }}
          >
            <img
              src={particles}
              draggable={false}
              className="w-2/3 absolute right-0 top-0"
            />
            <img
              src={bee}
              draggable={false}
              className="w-2/3 absolute left-0 bottom-0 group-active:animate-bzz"
            />
          </button>
        </div>
      </footer>
    </>
  )
}
