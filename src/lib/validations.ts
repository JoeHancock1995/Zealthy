import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const patientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const appointmentSchema = z.object({
  providerName: z.string().min(1),
  startDateTime: z.string().min(1),
  repeatSchedule: z.enum(["none", "weekly", "monthly"]),
  endDate: z.string().optional(),
});

export const prescriptionSchema = z.object({
  medicationName: z.string().min(1),
  dosage: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  refillDate: z.string().min(1),
  refillSchedule: z.enum(["none", "weekly", "monthly"]),
  endDate: z.string().optional(),
});
