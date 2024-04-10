import pack_icon from "~/assets/pack_icon"
import edit_icon from "~/assets/edit_icon.png"

import { useState } from "react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card"
import { FormField, FormItem, FormControl, FormLabel, FormFieldErrors } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

import { uriToFile } from "~/lib/utils"

import { type FormReturn } from "~/App"

export const GeneralOptions = ({ form }: { form: FormReturn }) => {
  const [packIconURL, setPackIconURL] = useState(pack_icon)

  return (
    <FormField
      control={form.control}
      name="general"
      render={({ fieldState }) => (
        <Card>
          <CardHeader>
            <CardTitle>General Details</CardTitle>
            <CardDescription>
              The builder will handle generating your pack’s manifest for you,
              but you need to give it a name, author, and description first.
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

                        new Promise((resolve: (value: string) => void) => {
                          const fileReader = new FileReader()

                          fileReader.onload = (data) => {
                            const img = document.createElement("img")

                            img.onload = () => {
                              const canvas = document.createElement("canvas")

                              canvas.width = 256
                              canvas.height = 256

                              const context = canvas.getContext("2d")!

                              context.drawImage(img, 0, 0, 256, 256)

                              resolve(canvas.toDataURL())
                            }

                            img.src = data.target!.result!.toString()
                          }

                          fileReader.readAsDataURL(file)
                        }).then((dataUri) => {
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
  )
}