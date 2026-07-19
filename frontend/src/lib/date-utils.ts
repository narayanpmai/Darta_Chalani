import NepaliDate from "nepali-datetime"

export function toNepaliNumber(num: number | string): string {
  if (num === null || num === undefined) return ""
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
  return num
    .toString()
    .split("")
    .map(digit => {
      const parsed = parseInt(digit)
      return isNaN(parsed) ? digit : nepaliDigits[parsed]
    })
    .join("")
}

/**
 * Returns a formatted Nepali Date in Devanagari numerals (e.g., २०८३/०४/०४).
 * If no date is passed, returns today's date in BS.
 */
export function formatNepaliDate(dateInput?: string | Date): string {
  try {
    let bsDate;
    if (dateInput) {
      const adDate = new Date(dateInput)
      bsDate = new NepaliDate(adDate)
    } else {
      bsDate = new NepaliDate()
    }
    
    const formatted = bsDate.format('YYYY/MM/DD')
    return toNepaliNumber(formatted)
  } catch (error) {
    // If parsing fails, just return current nepali date in devanagari
    return toNepaliNumber(new NepaliDate().format('YYYY/MM/DD'))
  }
}
