"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function createAppointment(patientId: string, formData: FormData) {
    const providerName = String(formData.get("providerName") ?? "").trim();
    const startDateTime = String(formData.get("startDateTime") ?? "").trim();
    const repeatSchedule = String(formData.get("repeatSchedule") ?? "none").trim();
    const endDate = String(formData.get("endDate") ?? "").trim();

    if (!providerName || !startDateTime) {
        throw new Error("Provider name and first appointment date are required.");
    }

    await db.appointment.create({
        data: {
            patientId,
            providerName,
            startDateTime: new Date(startDateTime),
            repeatSchedule:
                repeatSchedule === "weekly" || repeatSchedule === "monthly"
                    ? repeatSchedule
                    : "none",
            endDate: endDate ? new Date(endDate) : null,
        },
    });

    redirect(`/admin/patients/${patientId}/appointments`);
}

export async function deleteAppointment(
    patientId: string,
    appointmentId: string,
) {
    await db.appointment.delete({
        where: { id: appointmentId },
    });

    redirect(`/admin/patients/${patientId}/appointments`);
}