import NepaliDate from "nepali-datetime"

export function getDefaultDateForFiscalYear(fiscalYear: string): string {
  if (!fiscalYear) return new NepaliDate().format('YYYY-MM-DD');

  // Parse fiscal year string, e.g., "२०८२/०८३" or "2082/083"
  // Convert Nepali numerals to English numerals for logic if needed
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  
  let engFy = fiscalYear;
  for (let i = 0; i < 10; i++) {
    engFy = engFy.split(nepaliNumbers[i]).join(i.toString());
  }

  const parts = engFy.split('/');
  if (parts.length !== 2) return new NepaliDate().format('YYYY-MM-DD');

  const startYear = parseInt(parts[0], 10);
  const endYear = startYear + 1; // e.g. 2082 -> 2083

  const today = new NepaliDate();
  const currentYear = today.getYear();
  const currentMonth = today.getMonth() + 1; // 0-indexed to 1-12

  // Fiscal year starts from Shrawan (4) of startYear to Ashadh (3) of endYear
  let isWithinFy = false;

  if (currentYear === startYear && currentMonth >= 4) {
    isWithinFy = true;
  } else if (currentYear === endYear && currentMonth <= 3) {
    isWithinFy = true;
  }

  if (isWithinFy) {
    return today.format('YYYY-MM-DD');
  } else {
    // Return the first day of the fiscal year
    return `${startYear}-04-01`;
  }
}
