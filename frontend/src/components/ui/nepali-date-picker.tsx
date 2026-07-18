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
        inputClassName="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        className="nepali-datepicker"
        options={{ calenderLocale: "ne", valueLocale: "en" }}
      />
    </div>
  )
}
