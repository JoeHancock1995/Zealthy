import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PATIENT_COOKIE_NAME = "patientId";

export async function getPatientSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get(PATIENT_COOKIE_NAME)?.value ?? null;
}

export async function requirePatientSession() {
  const patientId = await getPatientSessionId();

  if (!patientId) {
    redirect("/");
  }

  return patientId;
}

export async function clearPatientSession() {
  const cookieStore = await cookies();

  cookieStore.set(PATIENT_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}