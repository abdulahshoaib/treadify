import * as React from "react"
import { format, startOfToday } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    value?: Date
    onChange: (date?: Date) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
    return (
        <Popover modal={false}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 hover:text-white text-white",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-50 p-0 w-auto pointer-events-auto bg-black text-white border-none">
                <Calendar
                    mode="single"
                    selected={value}
                    disabled={{before: startOfToday()}}
                    onSelect={(date) => { onChange(date) }}
                    className="rdp text-white"
                    classNames={{
                        day_selected: "bg-green-900 text-white hover:text-white hover:bg-green-700",
                        day_today: "border border-green-900"
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>

    )
}
