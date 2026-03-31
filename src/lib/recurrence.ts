import { addMonths, addWeeks, isAfter, isBefore } from "date-fns";

export type Schedule = "none" | "weekly" | "monthly";

export function generateOccurrences(startDate: Date, repeatSchedule: Schedule, rangeStart: Date, rangeEnd: Date, endDate?: Date | null): Date[] {
  const results: Date[] = [];
  const hardEnd = endDate && isBefore(endDate, rangeEnd) ? endDate : rangeEnd;
  let current = new Date(startDate);

  while (isBefore(current, rangeStart)) {
    if (repeatSchedule === "none") break;
    current = repeatSchedule === "weekly" ? addWeeks(current, 1) : addMonths(current, 1);
  }

  while ((isAfter(current, rangeStart) || current.getTime() === rangeStart.getTime()) && (isBefore(current, hardEnd) || current.getTime() === hardEnd.getTime())) {
    results.push(new Date(current));
    if (repeatSchedule === "none") break;
    current = repeatSchedule === "weekly" ? addWeeks(current, 1) : addMonths(current, 1);
  }

  return results;
}
