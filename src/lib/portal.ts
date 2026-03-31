import { addMonths, addWeeks, isAfter, isBefore } from "date-fns";

type RepeatSchedule = "none" | "weekly" | "monthly";

export type AppointmentLike = {
  id: string;
  providerName: string;
  startDateTime: Date;
  repeatSchedule: RepeatSchedule;
  endDate: Date | null;
};

export type PrescriptionLike = {
  id: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  refillDate: Date;
  refillSchedule: RepeatSchedule;
  endDate: Date | null;
};

export type AppointmentOccurrence = {
  sourceId: string;
  providerName: string;
  occurrenceDate: Date;
  repeatSchedule: RepeatSchedule;
};

export type PrescriptionOccurrence = {
  sourceId: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  occurrenceDate: Date;
  refillSchedule: RepeatSchedule;
};

function nextDate(current: Date, repeatSchedule: RepeatSchedule) {
  if (repeatSchedule === "weekly") return addWeeks(current, 1);
  if (repeatSchedule === "monthly") return addMonths(current, 1);
  return current;
}

function generateDates(
  startDate: Date,
  repeatSchedule: RepeatSchedule,
  rangeStart: Date,
  rangeEnd: Date,
  endDate?: Date | null,
) {
  const results: Date[] = [];
  const effectiveEnd =
    endDate && isBefore(endDate, rangeEnd) ? endDate : rangeEnd;

  let current = new Date(startDate);

  while (isBefore(current, rangeStart)) {
    if (repeatSchedule === "none") {
      break;
    }
    current = nextDate(current, repeatSchedule);
  }

  while (
    (isAfter(current, rangeStart) || current.getTime() === rangeStart.getTime()) &&
    (isBefore(current, effectiveEnd) || current.getTime() === effectiveEnd.getTime())
  ) {
    results.push(new Date(current));

    if (repeatSchedule === "none") {
      break;
    }

    current = nextDate(current, repeatSchedule);
  }

  return results;
}

export function expandAppointments(
  appointments: AppointmentLike[],
  rangeStart: Date,
  rangeEnd: Date,
): AppointmentOccurrence[] {
  return appointments
    .flatMap((appointment) =>
      generateDates(
        new Date(appointment.startDateTime),
        appointment.repeatSchedule,
        rangeStart,
        rangeEnd,
        appointment.endDate ? new Date(appointment.endDate) : null,
      ).map((occurrenceDate) => ({
        sourceId: appointment.id,
        providerName: appointment.providerName,
        occurrenceDate,
        repeatSchedule: appointment.repeatSchedule,
      })),
    )
    .sort((a, b) => a.occurrenceDate.getTime() - b.occurrenceDate.getTime());
}

export function expandPrescriptions(
  prescriptions: PrescriptionLike[],
  rangeStart: Date,
  rangeEnd: Date,
): PrescriptionOccurrence[] {
  return prescriptions
    .flatMap((prescription) =>
      generateDates(
        new Date(prescription.refillDate),
        prescription.refillSchedule,
        rangeStart,
        rangeEnd,
        prescription.endDate ? new Date(prescription.endDate) : null,
      ).map((occurrenceDate) => ({
        sourceId: prescription.id,
        medicationName: prescription.medicationName,
        dosage: prescription.dosage,
        quantity: prescription.quantity,
        occurrenceDate,
        refillSchedule: prescription.refillSchedule,
      })),
    )
    .sort((a, b) => a.occurrenceDate.getTime() - b.occurrenceDate.getTime());
}