import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateAppointment } from "../../actions";

function formatForDateTimeLocal(value: Date | string | null | undefined) {
    if (!value) return "";

    const date = new Date(value);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default async function EditAppointmentPage({
    params,
}: {
    params: Promise<{ id: string; appointmentId: string }>;
}) {
    const { id, appointmentId } = await params;

    const patient = await db.patient.findUnique({
        where: { id },
    });

    if (!patient) {
        notFound();
    }

    const appointment = await db.appointment.findFirst({
        where: {
            id: appointmentId,
            patientId: id,
        },
    });

    if (!appointment) {
        notFound();
    }

    const updateAppointmentWithIds = updateAppointment.bind(
        null,
        patient.id,
        appointment.id,
    );

    return (
        <main>
            <div className="space-between" style={{ marginBottom: 20 }}>
                <div>
                    <span className="badge">Admin / Patient / Appointments / Edit</span>
                    <h1 style={{ marginTop: 12 }}>Edit Appointment</h1>
                    <p>Update the appointment record for {patient.name}.</p>
                </div>

                <div className="row">
                    <Link href={`/admin/patients/${patient.id}/appointments`}>
                        <button type="button" className="secondary" style={{ width: "auto" }}>
                            Back to Appointments
                        </button>
                    </Link>
                </div>
            </div>

            <section className="card" style={{ maxWidth: 720 }}>
                <form action={updateAppointmentWithIds} className="stack">
                    <label>
                        Provider Name
                        <input
                            name="providerName"
                            type="text"
                            defaultValue={appointment.providerName}
                            required
                        />
                    </label>

                    <label>
                        First Appointment Date & Time
                        <input
                            name="startDateTime"
                            type="datetime-local"
                            defaultValue={formatForDateTimeLocal(appointment.startDateTime)}
                            required
                        />
                    </label>

                    <label>
                        Repeat Schedule
                        <select name="repeatSchedule" defaultValue={appointment.repeatSchedule}>
                            <option value="none">None</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </label>

                    <label>
                        End Recurring Appointments
                        <input
                            name="endDate"
                            type="datetime-local"
                            defaultValue={formatForDateTimeLocal(appointment.endDate)}
                        />
                    </label>

                    <div className="row">
                        <button type="submit" style={{ width: "auto" }}>
                            Save Changes
                        </button>

                        <Link href={`/admin/patients/${patient.id}/appointments`}>
                            <button type="button" className="secondary" style={{ width: "auto" }}>
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            </section>
        </main>
    );
}