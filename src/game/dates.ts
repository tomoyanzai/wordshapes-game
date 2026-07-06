// All game logic works with LOCAL "YYYY-MM-DD" strings and integer day
// numbers. Never use toISOString() for "today" — it is UTC and rolls the
// date over early/late for anyone not living at Greenwich.

export function localDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Days since epoch for a "YYYY-MM-DD" string. Pure integer math via UTC — immune to DST. */
export function dayNumber(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return Date.UTC(y, m - 1, d) / 86_400_000
}

export function dateStringFromDayNumber(day: number): string {
  const d = new Date(day * 86_400_000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function yesterdayOf(dateStr: string): string {
  return dateStringFromDayNumber(dayNumber(dateStr) - 1)
}
