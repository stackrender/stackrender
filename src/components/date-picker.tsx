

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"


interface DatePickerProps {
    value?: Date | undefined;
    onValueChange?: (value?: Date) => void;
    noLabel?: boolean;
    className?: string; 
    placeholder?: string ;  
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onValueChange, noLabel = false, className , placeholder = "Pick a date"}) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(value)

    React.useEffect(() => {
        setDate (value) ; 
    } , [ value])

    React.useEffect(() => {
        onValueChange && onValueChange(date)
    }, [date])
    return (
        <div className="flex flex-col gap-3">
            {
                !noLabel &&
                <Label htmlFor="date" className="px-1">
                    {placeholder}
                </Label>
            }
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className={cn("w-full justify-between font-normal" , className)}
                    >
                        {date ? date.toLocaleDateString() : placeholder }
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}


export { DatePicker } 