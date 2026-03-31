"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function createPrescription(patientId: string, formData: FormData) {
    const medicationName = String(formData.get("medicationName") ?? "").trim();
    const dosage = String(formData.get("dosage") ?? "").trim();
    const quantityValue = String(formData.get("quantity") ?? "").trim();
    const refillDate = String(formData.get("refillDate") ?? "").trim();
    const refillSchedule = String(formData.get("refillSchedule") ?? "none").trim();
    const endDate = String(formData.get("endDate") ?? "").trim();

    if (!medicationName || !dosage || !quantityValue || !refillDate) {
        throw new Error("Medication, dosage, quantity, and refill date are required.");
    }

    const quantity = Number(quantityValue);

    if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a positive number.");
    }

    await db.prescription.create({
        data: {
            patientId,
            medicationName,
            dosage,
            quantity,
            refillDate: new Date(refillDate),
            refillSchedule:
                refillSchedule === "weekly" || refillSchedule === "monthly"
                    ? refillSchedule
                    : "none",
            endDate: endDate ? new Date(endDate) : null,
        },
    });

    redirect(`/admin/patients/${patientId}/prescriptions` as any);
}

export async function deletePrescription(
    patientId: string,
    prescriptionId: string,
) {
    await db.prescription.delete({
        where: { id: prescriptionId },
    });

    redirect(`/admin/patients/${patientId}/prescriptions` as any);
}