export function formatISO(date: Date): string {
  return date.toISOString();
}

export function differenceInCalendarDays(later: Date, earlier: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const startOfLater = new Date(later.getFullYear(), later.getMonth(), later.getDate());
  const startOfEarlier = new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
  return Math.round((startOfLater.getTime() - startOfEarlier.getTime()) / MS_PER_DAY);
}

export function isAfter(date: Date, comparison: Date): boolean {
  return date.getTime() > comparison.getTime();
}
