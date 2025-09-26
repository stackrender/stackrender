"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

 

interface ComboboxProps {
  items: any[]
  label?: string;
  placeholder?: string;
  selectedItem?: string;
  onSelectionChange?: (id: string) => void;
  className?: string;
  isDisabled?: boolean 
}


export const Combobox = (props: ComboboxProps) => {

  const { items, label = "label", placeholder, onSelectionChange, selectedItem, className, isDisabled } = props;
  const [query, setQuery] = React.useState<string>("");

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | undefined>("")

  React.useEffect(() => {
    setValue(selectedItem);
  }, [selectedItem]);

  React.useEffect(() => {
    onSelectionChange && onSelectionChange(value as string);
  }, [value])


  React.useEffect(() => {
    if (open)
      setQuery(""); 
  }, [open])

  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isDisabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {value
            ? items.find((item) => item.id === value)?.[label]
            : (placeholder ? placeholder : "Select items...")}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {

            return 1
          }}

        >
          <CommandInput placeholder={placeholder ? placeholder : "Select items..."}

            onValueChange={setQuery}

          />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {items.filter((item: any) => (item[label] as string).toLocaleLowerCase().includes(query.toLocaleLowerCase())).map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item[label]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}