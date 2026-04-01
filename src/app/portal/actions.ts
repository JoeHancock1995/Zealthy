export const runtime = "nodejs";

import { redirect } from "next/navigation";
import { clearPatientSession } from "@/lib/auth";

// async functions can still run on the server here
export async function logout() {
    await clearPatientSession();
    redirect("/login");
}