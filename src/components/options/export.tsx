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
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"

import { type FormReturn } from "~/App"

export const ExportOptions = ({ form }: { form: FormReturn }) => {
  const versionOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (...event: unknown[]) => void
  ) => {
    let newValue = event.target.value.split(".")

    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3)
    }

    fieldOnChange(newValue)
  }

  const versionOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>, fieldOnChange: (...event: unknown[]) => void) => {
    fieldOnChange(event.target.value.split(".").map(v => Number(v)))
  }

  return (
    <FormField
      control={form.control}
      name="export"
      render={({ fieldState }) => (
        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>
              You can choose to export this as either a <code>.zip</code> or{" "}
              <code>.mcpack</code> file.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="export.version"
                render={({
                  field: { disabled, name, onChange, ref, value },
                }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={disabled}
                        name={name}
                        onBlur={(e) => versionOnBlur(e, onChange)}
                        onChange={(e) => versionOnChange(e, onChange)}
                        ref={ref}
                        value={value.join(".")}
                        placeholder="Pack version:"
                        autoComplete="off"
                        keepPlaceholder
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="export.engine_version"
                render={({
                  field: { disabled, name, onChange, ref, value },
                }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={disabled}
                        name={name}
                        onBlur={(e) => versionOnBlur(e, onChange)}
                        onChange={(e) => versionOnChange(e, onChange)}
                        ref={ref}
                        value={value.join(".")}
                        placeholder="Engine version:"
                        autoComplete="off"
                        keepPlaceholder
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {fieldState.error && (
              <div className="flex flex-col gap-1">
                <FormFieldErrors form={form} />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-6">
            <Button onClick={() => form.setValue("export.mcpack", false)}>
              Export as zip
            </Button>
            <Button onClick={() => form.setValue("export.mcpack", true)}>
              Export as mcpack
            </Button>
          </CardFooter>
        </Card>
      )}
    />
  )
}
