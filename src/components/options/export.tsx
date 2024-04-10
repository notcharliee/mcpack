import { Button } from "~/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card"

import { type FormReturn } from "~/App"

export const ExportOptions = ({ form }: { form: FormReturn }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export</CardTitle>
        <CardDescription>
          You can choose to export this as either a zip file or mcpack file.
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
  )
}
