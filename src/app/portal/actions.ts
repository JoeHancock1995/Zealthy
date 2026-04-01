"use server";

import { redirect } from "next/navigation";
import { clearPatientSession } from "@/lib/auth";

export async function logoutPatient() {
    await clearPatientSession();
    redirect("/login");
}