"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function updatePatient(id: string, formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!name || !email) {
        throw new Error("Name and email are required.");
    }

    const existingPatient = await db.patient.findUnique({
        where: { id },
    });

    if (!existingPatient) {
        throw new Error("Patient not found.");
    }

    const emailOwner = await db.patient.findUnique({
        where: { email },
    });

    if (emailOwner && emailOwner.id !== id) {
        throw new Error("A patient with that email already exists.");
    }

    await db.patient.update({
        where: { id },
        data: {
            name,
            email,
            ...(password
                ? {
                    passwordHash: await bcrypt.hash(password, 10),
                }
                : {}),
        },
    });

    redirect(`/admin/patients/${id}`);
}