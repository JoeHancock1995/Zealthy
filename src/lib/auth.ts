import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const COOKIE_NAME = "zealthy_patient_session";

export async function loginPatient(email: string, password: string) {
  const patient = await db.patient.findUnique({ where: { email } });
  if (!patient) return null;

  const isValid = await bcrypt.compare(password, patient.passwordHash);
  if (!isValid) return null;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, patient.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return patient;
}

export async function logoutPatient() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentPatient() {
  const cookieStore = await cookies();
  const patientId = cookieStore.get(COOKIE_NAME)?.value;
  if (!patientId) return null;
  return db.patient.findUnique({ where: { id: patientId } });
}

export async function requirePatient() {
  const patient = await getCurrentPatient();
  if (!patient) redirect("/");
  return patient;
}
