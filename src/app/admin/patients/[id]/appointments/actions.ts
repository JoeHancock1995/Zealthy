"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

function normalizeRepeatSchedule(value: string) {
    return value === "weekly" || value === "monthly" ? value : "none";
}

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
            repeatSchedule: normalizeRepeatSchedule(repeatSchedule),
            endDate: endDate ? new Date(endDate) : null,
        },
    });

    redirect(`/admin/patients/${patientId}/appointments`);
}

export async function updateAppointment(
    patientId: string,
    appointmentId: string,
    formData: FormData,
) {
    const providerName = String(formData.get("providerName") ?? "").trim();
    const startDateTime = String(formData.get("startDateTime") ?? "").trim();
    const repeatSchedule = String(formData.get("repeatSchedule") ?? "none").trim();
    const endDate = String(formData.get("endDate") ?? "").trim();

    if (!providerName || !startDateTime) {
        throw new Error("Provider name and first appointment date are required.");
    }

    const existing = await db.appointment.findFirst({
        where: {
            id: appointmentId,
            patientId,
        },
    });

    if (!existing) {
        throw new Error("Appointment not found.");
    }

    await db.appointment.update({
        where: { id: appointmentId },
        data: {
            providerName,
            startDateTime: new Date(startDateTime),
            repeatSchedule: normalizeRepeatSchedule(repeatSchedule),
            endDate: endDate ? new Date(endDate) : null,
        },
    });

    redirect(`/admin/patients/${patientId}/appointments`);
}

export async function deleteAppointment(patientId: string, appointmentId: string) {
    const existing = await db.appointment.findFirst({
        where: {
            id: appointmentId,
            patientId,
        },
    });

    if (!existing) {
        throw new Error("Appointment not found.");
    }

    await db.appointment.delete({
        where: { id: appointmentId },
    });

    redirect(`/admin/patients/${patientId}/appointments`);
}