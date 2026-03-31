"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { loginPatient, logoutPatient } from "@/lib/auth";
import { appointmentSchema, loginSchema, patientSchema, prescriptionSchema } from "@/lib/validations";
import { RepeatSchedule } from "@prisma/client";

function toSchedule(value: string): RepeatSchedule {
  if (value === "weekly") return RepeatSchedule.weekly;
  if (value === "monthly") return RepeatSchedule.monthly;
  return RepeatSchedule.none;
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/?error=Invalid%20email%20or%20password%20format");
  const patient = await loginPatient(parsed.data.email, parsed.data.password);
  if (!patient) redirect("/?error=Invalid%20credentials");
  redirect("/portal");
}

export async function logoutAction() {
  await logoutPatient();
  redirect("/");
}

export async function createPatientAction(formData: FormData) {
  const parsed = patientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/admin/patients/new?error=Please%20complete%20all%20patient%20fields");

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const patient = await db.patient.create({ data: { name: parsed.data.name, email: parsed.data.email, passwordHash } });
  revalidatePath("/admin");
  redirect(`/admin/patients/${patient.id}`);
}

export async function updatePatientAction(patientId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const data: { name: string; email: string; passwordHash?: string } = { name, email };
  if (password) data.passwordHash = await bcrypt.hash(password, 10);
  await db.patient.update({ where: { id: patientId }, data });
  revalidatePath("/admin");
  revalidatePath(`/admin/patients/${patientId}`);
  redirect(`/admin/patients/${patientId}`);
}

export async function createAppointmentAction(patientId: string, formData: FormData) {
  const parsed = appointmentSchema.safeParse({
    providerName: formData.get("providerName"),
    startDateTime: formData.get("startDateTime"),
    repeatSchedule: formData.get("repeatSchedule"),
    endDate: formData.get("endDate"),
  });
  if (!parsed.success) redirect(`/admin/patients/${patientId}?error=Invalid%20appointment%20data`);

  await db.appointment.create({
    data: {
      patientId,
      providerName: parsed.data.providerName,
      startDateTime: new Date(parsed.data.startDateTime),
      repeatSchedule: toSchedule(parsed.data.repeatSchedule),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  });
  revalidatePath(`/admin/patients/${patientId}`);
  revalidatePath(`/portal`);
  redirect(`/admin/patients/${patientId}`);
}

export async function deleteAppointmentAction(patientId: string, appointmentId: string) {
  await db.appointment.delete({ where: { id: appointmentId } });
  revalidatePath(`/admin/patients/${patientId}`);
  revalidatePath(`/portal`);
}

export async function createPrescriptionAction(patientId: string, formData: FormData) {
  const parsed = prescriptionSchema.safeParse({
    medicationName: formData.get("medicationName"),
    dosage: formData.get("dosage"),
    quantity: formData.get("quantity"),
    refillDate: formData.get("refillDate"),
    refillSchedule: formData.get("refillSchedule"),
    endDate: formData.get("endDate"),
  });
  if (!parsed.success) redirect(`/admin/patients/${patientId}?error=Invalid%20prescription%20data`);

  await db.prescription.create({
    data: {
      patientId,
      medicationName: parsed.data.medicationName,
      dosage: parsed.data.dosage,
      quantity: parsed.data.quantity,
      refillDate: new Date(parsed.data.refillDate),
      refillSchedule: toSchedule(parsed.data.refillSchedule),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  });
  revalidatePath(`/admin/patients/${patientId}`);
  revalidatePath(`/portal`);
  redirect(`/admin/patients/${patientId}`);
}

export async function deletePrescriptionAction(patientId: string, prescriptionId: string) {
  await db.prescription.delete({ where: { id: prescriptionId } });
  revalidatePath(`/admin/patients/${patientId}`);
  revalidatePath(`/portal`);
}
