import "~/styles/globals.css"

import pack_icon from "~/assets/pack_icon.ts"
import bass from "~/assets/audio/bass.ogg"

import { useForm, FormProvider, type UseFormReturn } from "react-hook-form"
import { useUnsavedChangesWarning } from "~/hooks/useUnsavedChangesWarning"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Footer } from "~/components/footer"
import { Header } from "~/components/header"

import { GeneralOptions } from "~/components/options/general"
import { MusicOptions } from "~/components/options/music"
import { ExportOptions } from "~/components/options/export"

import { buildPack } from "~/lib/build"
import { uriToFile } from "~/lib/utils"

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
  export: z.object({
    mcpack: z.boolean(),
    version: z.array(z.number()).length(3, "Invalid pack version."),
    engine_version: z.array(z.number()).length(3, "Invalid pack version."),
  }),
})

export type FormValues = z.infer<typeof formSchema>
export type FormReturn = UseFormReturn<FormValues>

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
      music: [],
      export: {
        mcpack: false,
        version: [1, 0, 0],
        engine_version: [1, 20, 0]
      },
    },
  })

  useUnsavedChangesWarning(form.formState.isDirty)

  return (
    <>
      <Header />
      <main>
        <FormProvider {...form}>
          <form
            className="space-y-8 sm:space-y-10 py-8 md:py-12 container mx-auto"
            onSubmit={form.handleSubmit(buildPack, () => {
              new Audio(bass).play()
            })}
          >
            <GeneralOptions form={form} />
            <MusicOptions form={form} />
            <ExportOptions form={form} />
          </form>
        </FormProvider>
      </main>
      <Footer />
    </>
  )
}
