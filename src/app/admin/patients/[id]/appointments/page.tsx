export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createAppointment, deleteAppointment } from "./actions";

function formatDate(value: Date | null | undefined) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatRepeatSchedule(value: string) {
    if (!value) return "None";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function PatientAppointmentsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const patient = await db.patient.findUnique({
        where: { id },
        include: {
            appointments: {
                orderBy: { startDateTime: "asc" },
            },
        },
    });

    if (!patient) {
        notFound();
    }

    const createAppointmentWithPatientId = createAppointment.bind(null, patient.id);

    return (
        <main>
            <div className="space-between" style={{ marginBottom: 20 }}>
                <div>
                    <span className="badge">Admin / Patient / Appointments</span>
                    <h1 style={{ marginTop: 12 }}>Manage Appointments</h1>
                    <p>Create, edit, and delete appointment records for {patient.name}.</p>
                </div>

                <div className="row">
                    <Link href={`/admin/patients/${patient.id}`}>
                        <button type="button" className="secondary" style={{ width: "auto" }}>
                            Back to Patient
                        </button>
                    </Link>

                    <Link href="/admin">
                        <button type="button" className="secondary" style={{ width: "auto" }}>
                            Back to Patients
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-2">
                <section className="card">
                    <div className="stack">
                        <h2>New Appointment</h2>
                        <p>
                            Add the provider, first appointment date/time, repeat schedule, and
                            optional end date.
                        </p>

                        <form action={createAppointmentWithPatientId} className="stack">
                            <label>
                                Provider Name
                                <input name="providerName" type="text" placeholder="Dr. Smith" required />
                            </label>

                            <label>
                                First Appointment Date & Time
                                <input name="startDateTime" type="datetime-local" required />
                            </label>

                            <label>
                                Repeat Schedule
                                <select name="repeatSchedule" defaultValue="none">
                                    <option value="none">None</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </label>

                            <label>
                                End Recurring Appointments
                                <input name="endDate" type="datetime-local" />
                            </label>

                            <div className="row">
                                <button type="submit" style={{ width: "auto" }}>
                                    Create Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="card">
                    <div className="stack">
                        <h2>Patient Summary</h2>

                        <div>
                            <div className="small">Name</div>
                            <div>{patient.name}</div>
                        </div>

                        <div>
                            <div className="small">Email</div>
                            <div>{patient.email}</div>
                        </div>

                        <div>
                            <div className="small">Total Appointments</div>
                            <div>{patient.appointments.length}</div>
                        </div>

                        <div>
                            <div className="small">Next Appointment</div>
                            <div>
                                {patient.appointments[0]
                                    ? `${patient.appointments[0].providerName} — ${formatDate(
                                        patient.appointments[0].startDateTime,
                                    )}`
                                    : "—"}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="card" style={{ marginTop: 20 }}>
                <div className="space-between" style={{ marginBottom: 16 }}>
                    <div>
                        <h2>Appointment Records</h2>
                        <p>All appointment records currently saved for this patient.</p>
                    </div>
                </div>

                {patient.appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>First Appointment</th>
                                <th>Repeat Schedule</th>
                                <th>Ends</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patient.appointments.map((appointment) => {
                                const deleteAppointmentWithIds = deleteAppointment.bind(
                                    null,
                                    patient.id,
                                    appointment.id,
                                );

                                return (
                                    <tr key={appointment.id}>
                                        <td>{appointment.providerName}</td>
                                        <td>{formatDate(appointment.startDateTime)}</td>
                                        <td>{formatRepeatSchedule(appointment.repeatSchedule)}</td>
                                        <td>{formatDate(appointment.endDate)}</td>
                                        <td>
                                            <div className="row">
                                                <Link
                                                    href={`/admin/patients/${patient.id}/appointments/${appointment.id}/edit`}
                                                >
                                                    <button type="button" className="secondary" style={{ width: "auto" }}>
                                                        Edit
                                                    </button>
                                                </Link>

                                                <form action={deleteAppointmentWithIds} className="inline">
                                                    <button
                                                        type="submit"
                                                        className="danger"
                                                        style={{ width: "auto" }}
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}