import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setPatientSession } from "@/lib/auth";

export async function POST(req: Request) {
    const formData = await req.formData();

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required." },
            { status: 400 },
        );
    }

    const patient = await db.patient.findUnique({
        where: { email },
    });

    if (!patient) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 },
        );
    }

    const isValid = await bcrypt.compare(password, patient.passwordHash);

    if (!isValid) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 },
        );
    }

    await setPatientSession(patient.id);

    return NextResponse.json({ success: true });
}