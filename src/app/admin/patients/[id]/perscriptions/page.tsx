import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createPrescription, deletePrescription } from "./actions";

function formatDate(value: Date | null | undefined) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatForDateTimeLocal(value: Date | string) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatRepeatSchedule(value: string) {
    if (!value) return "None";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function PatientPrescriptionsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const patient = await db.patient.findUnique({
        where: { id },
        include: {
            prescriptions: {
                orderBy: { refillDate: "asc" },
            },
        },
    });

    if (!patient) {
        notFound();
    }

    const medicationOptions = await db.medicationOption.findMany({
        orderBy: { name: "asc" },
    });

    const dosageOptions = await db.dosageOption.findMany({
        orderBy: { value: "asc" },
    });

    const createPrescriptionWithPatientId = createPrescription.bind(null, patient.id);

    return (
        <main>
            <div className="space-between" style={{ marginBottom: 20 }}>
                <div>
                    <span className="badge">Admin / Patient / Prescriptions</span>
                    <h1 style={{ marginTop: 12 }}>Manage Prescriptions</h1>
                    <p>Create and manage medication records for {patient.name}.</p>
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
                        <h2>New Prescription</h2>
                        <p>
                            Add the medication, dosage, quantity, refill date, refill schedule,
                            and optional end date.
                        </p>

                        <form action={createPrescriptionWithPatientId} className="stack">
                            <label>
                                Medication
                                <select
                                    name="medicationName"
                                    defaultValue={medicationOptions[0]?.name ?? ""}
                                    required
                                >
                                    {medicationOptions.length === 0 ? (
                                        <option value="">No medication options found</option>
                                    ) : (
                                        medicationOptions.map((option) => (
                                            <option key={option.id} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </label>

                            <label>
                                Dosage
                                <select
                                    name="dosage"
                                    defaultValue={dosageOptions[0]?.value ?? ""}
                                    required
                                >
                                    {dosageOptions.length === 0 ? (
                                        <option value="">No dosage options found</option>
                                    ) : (
                                        dosageOptions.map((option) => (
                                            <option key={option.id} value={option.value}>
                                                {option.value}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </label>

                            <label>
                                Quantity
                                <input
                                    name="quantity"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="30"
                                    required
                                />
                            </label>

                            <label>
                                Refill Date
                                <input
                                    name="refillDate"
                                    type="datetime-local"
                                    required
                                />
                            </label>

                            <label>
                                Refill Schedule
                                <select name="refillSchedule" defaultValue="none">
                                    <option value="none">None</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </label>

                            <label>
                                End Recurring Refills
                                <input name="endDate" type="datetime-local" />
                            </label>

                            <div className="row">
                                <button type="submit" style={{ width: "auto" }}>
                                    Create Prescription
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
                            <div className="small">Total Prescriptions</div>
                            <div>{patient.prescriptions.length}</div>
                        </div>

                        <div>
                            <div className="small">Next Refill</div>
                            <div>
                                {patient.prescriptions[0]
                                    ? `${patient.prescriptions[0].medicationName} — ${formatDate(
                                        patient.prescriptions[0].refillDate,
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
                        <h2>Prescription Records</h2>
                        <p>All prescription records currently saved for this patient.</p>
                    </div>
                </div>

                {patient.prescriptions.length === 0 ? (
                    <p>No prescriptions found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Medication</th>
                                <th>Dosage</th>
                                <th>Quantity</th>
                                <th>Refill Date</th>
                                <th>Refill Schedule</th>
                                <th>Ends</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patient.prescriptions.map((prescription) => {
                                const deletePrescriptionWithIds = deletePrescription.bind(
                                    null,
                                    patient.id,
                                    prescription.id,
                                );

                                return (
                                    <tr key={prescription.id}>
                                        <td>{prescription.medicationName}</td>
                                        <td>{prescription.dosage}</td>
                                        <td>{prescription.quantity}</td>
                                        <td>{formatDate(prescription.refillDate)}</td>
                                        <td>{formatRepeatSchedule(prescription.refillSchedule)}</td>
                                        <td>{formatDate(prescription.endDate)}</td>
                                        <td>
                                            <div className="row">
                                                <form action={deletePrescriptionWithIds} className="inline">
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

            <section className="card" style={{ marginTop: 20 }}>
                <div className="stack">
                    <h2>Testing Examples</h2>
                    <p className="small">
                        Example refill date value for quick testing:
                    </p>
                    <code>{formatForDateTimeLocal(new Date())}</code>
                </div>
            </section>
        </main>
    );
}