import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updatePrescription } from "../../actions";

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

export default async function EditPrescriptionPage({
    params,
}: {
    params: Promise<{ id: string; prescriptionId: string }>;
}) {
    const { id, prescriptionId } = await params;

    const patient = await db.patient.findUnique({
        where: { id },
    });

    if (!patient) {
        notFound();
    }

    const prescription = await db.prescription.findFirst({
        where: {
            id: prescriptionId,
            patientId: id,
        },
    });

    if (!prescription) {
        notFound();
    }

    const medicationOptions = await db.medicationOption.findMany({
        orderBy: { name: "asc" },
    });

    const dosageOptions = await db.dosageOption.findMany({
        orderBy: { value: "asc" },
    });

    const updatePrescriptionWithIds = updatePrescription.bind(
        null,
        patient.id,
        prescription.id,
    );

    return (
        <main>
            <div className="space-between" style={{ marginBottom: 20 }}>
                <div>
                    <span className="badge">Admin / Patient / Prescriptions / Edit</span>
                    <h1 style={{ marginTop: 12 }}>Edit Prescription</h1>
                    <p>Update the prescription record for {patient.name}.</p>
                </div>

                <div className="row">
                    <Link href={`/admin/patients/${patient.id}/prescriptions`}>
                        <button type="button" className="secondary" style={{ width: "auto" }}>
                            Back to Prescriptions
                        </button>
                    </Link>
                </div>
            </div>

            <section className="card" style={{ maxWidth: 720 }}>
                <form action={updatePrescriptionWithIds} className="stack">
                    <label>
                        Medication
                        <select
                            name="medicationName"
                            defaultValue={prescription.medicationName}
                            required
                        >
                            {medicationOptions.map((option) => (
                                <option key={option.id} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Dosage
                        <select
                            name="dosage"
                            defaultValue={prescription.dosage}
                            required
                        >
                            {dosageOptions.map((option) => (
                                <option key={option.id} value={option.value}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Quantity
                        <input
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            defaultValue={prescription.quantity}
                            required
                        />
                    </label>

                    <label>
                        Refill Date
                        <input
                            name="refillDate"
                            type="datetime-local"
                            defaultValue={formatForDateTimeLocal(prescription.refillDate)}
                            required
                        />
                    </label>

                    <label>
                        Refill Schedule
                        <select
                            name="refillSchedule"
                            defaultValue={prescription.refillSchedule}
                        >
                            <option value="none">None</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </label>

                    <label>
                        End Recurring Refills
                        <input
                            name="endDate"
                            type="datetime-local"
                            defaultValue={formatForDateTimeLocal(prescription.endDate)}
                        />
                    </label>

                    <div className="row">
                        <button type="submit" style={{ width: "auto" }}>
                            Save Changes
                        </button>

                        <Link href={`/admin/patients/${patient.id}/prescriptions`}>
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