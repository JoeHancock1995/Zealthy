import { addDays, addMonths, endOfDay, format, startOfDay } from "date-fns";
import { RepeatSchedule } from "@prisma/client";
import { generateOccurrences } from "@/lib/recurrence";

export type UpcomingEvent = { id: string; label: string; date: Date; subtitle?: string };

export function toSchedule(value: RepeatSchedule): "none" | "weekly" | "monthly" {
  if (value === "weekly") return "weekly";
  if (value === "monthly") return "monthly";
  return "none";
}

export function buildUpcomingAppointments(appointments: Array<{ id: string; providerName: string; startDateTime: Date; repeatSchedule: RepeatSchedule; endDate: Date | null }>, months = 3): UpcomingEvent[] {
  const now = startOfDay(new Date());
  const end = endOfDay(addMonths(now, months));
  return appointments.flatMap((appointment) =>
    generateOccurrences(appointment.startDateTime, toSchedule(appointment.repeatSchedule), now, end, appointment.endDate).map((date, idx) => ({
      id: `${appointment.id}-${idx}`,
      label: appointment.providerName,
      date,
      subtitle: `Appointment · ${format(date, "PPP p")}`,
    }))
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function buildUpcomingRefills(prescriptions: Array<{ id: string; medicationName: string; dosage: string; refillDate: Date; refillSchedule: RepeatSchedule; endDate: Date | null }>, months = 3): UpcomingEvent[] {
  const now = startOfDay(new Date());
  const end = endOfDay(addMonths(now, months));
  return prescriptions.flatMap((prescription) =>
    generateOccurrences(prescription.refillDate, toSchedule(prescription.refillSchedule), now, end, prescription.endDate).map((date, idx) => ({
      id: `${prescription.id}-${idx}`,
      label: `${prescription.medicationName} ${prescription.dosage}`,
      date,
      subtitle: `Refill · ${format(date, "PPP")}`,
    }))
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function filterNext7Days<T extends { date: Date }>(items: T[]) {
  const today = startOfDay(new Date());
  const end = endOfDay(addDays(today, 7));
  return items.filter((item) => item.date >= today && item.date <= end);
}
