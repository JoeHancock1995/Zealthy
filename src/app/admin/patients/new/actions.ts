"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function createPatientAction(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!name || !email || !password) {
        throw new Error("All fields are required.");
    }

    const existing = await db.patient.findUnique({
        where: { email },
    });

    if (existing) {
        throw new Error("A patient with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.patient.create({
        data: {
            name,
            email,
            passwordHash,
        },
    });

    redirect("/admin");
}