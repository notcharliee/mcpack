import { Button } from "~/components/ui/button"

export const Header = () => (
  <footer className="bg-card py-6 border-b-2 text-foreground">
    <div className="flex justify-between container mx-auto">
      <div className="flex items-center gap-4 text-balance">
        <img src="/favicon.png" className="h-8 w-8" />
        <h4 className="text-3xl leading-none font-serif-heading">
          McPack
        </h4>
      </div>
      <Button className="py-0">Import</Button>
    </div>
  </footer>
)
