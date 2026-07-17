"use client"

import React from "react"
// @ts-ignore
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import { cn } from "@/lib/utils"

interface NepaliDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export function NepaliDatePickerComponent({ value, onChange, className, id }: NepaliDatePickerProps) {
  return (
    <div className={cn("w-full nepali-date-picker-wrapper", className)} id={id}>
      <NepaliDatePicker
        value={value || ""}
        onChange={(date: string) => onChange(date)}
        inputClassName="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        className="nepali-datepicker"
        options={{ calenderLocale: "ne", valueLocale: "en" }}
      />
    </div>
  )
}
