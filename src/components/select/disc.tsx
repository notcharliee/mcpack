import arrow_icon from "~/assets/arrow_icon.png"
import check_icon from "~/assets/check_icon.png"

import * as React from "react"

import { CommandList } from "cmdk"

import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { cn } from "~/lib/utils"
import discs from "~/lib/discs"

export function SelectDisc(props: {
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}) {
  const frameworks = Object.keys(discs).map((disc) => ({
    label: disc.replace(/^[a-z]/, match => match.toUpperCase()),
    value: disc,
  }))

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | null>(props.value ?? null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={props.disabled}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full max-w-md active:brightness-100 active:scale-100"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select a music disc..."}
          <img
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
            src={arrow_icon}
            width={16}
            height={16}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popper-anchor-width)] max-h-72 p-0 overflow-auto">
        <Command>
          <CommandInput placeholder="Search discs..." className="h-9" />
          <CommandEmpty>No disc found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    if (props.onChange) props.onChange(currentValue)
                    else setValue(currentValue === value ? null : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <img
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                    src={check_icon}
                    width={16}
                    height={16}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
