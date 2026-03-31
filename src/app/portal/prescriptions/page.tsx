import Link from "next/link";
import { addMonths } from "date-fns";
import { db } from "@/lib/db";
import { requirePatientSession } from "@/lib/auth";
import { expandPrescriptions } from "@/lib/portal";

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

export default async function PortalPrescriptionsPage() {
  const patientId = await requirePatientSession();

  const patient = await db.patient.findUnique({
    where: { id: patientId },
    include: {
      prescriptions: {
        orderBy: { refillDate: "asc" },
      },
    },
  });

  if (!patient) {
    const { redirect } = await import("next/navigation");
    return redirect("/");
  }

  const now = new Date();
  const next3Months = addMonths(now, 3);
  const occurrences = expandPrescriptions(patient.prescriptions, now, next3Months);

  return (
    <main>
      <div className="space-between" style={{ marginBottom: 20 }}>
        <div>
          <span className="">Patient Portal / Prescriptions</span>
          <h1 style={{ marginTop: 12 }}>Prescriptions</h1>
          <p>Medication records and refill occurrences in the next 3 months.</p>
        </div>

        <Link href="/portal">
          <button type="button" className="secondary" style={{ width: "auto" }}>
            Back to Portal
          </button>
        </Link>
      </div>

      <section className="card" style={{ marginBottom: 20 }}>
        <div className="stack">
          <div className="small">Patient</div>
          <div>{patient.name}</div>
        </div>
      </section>

      <section className="card" style={{ marginBottom: 20 }}>
        <div className="space-between" style={{ marginBottom: 12 }}>
          <h2>All Prescription Records</h2>
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
                <th>First Refill</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {patient.prescriptions.map((item) => (
                <tr key={item.id}>
                  <td>{item.medicationName}</td>
                  <td>{item.dosage}</td>
                  <td>{item.quantity}</td>
                  <td>{formatDate(item.refillDate)}</td>
                  <td>{formatRepeatSchedule(item.refillSchedule)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <div className="space-between" style={{ marginBottom: 12 }}>
          <h2>Upcoming Refill Schedule</h2>
        </div>

        {occurrences.length === 0 ? (
          <p>No refill occurrences in the next 3 months.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Quantity</th>
                <th>Refill Date</th>
              </tr>
            </thead>
            <tbody>
              {occurrences.map((item, index) => (
                <tr key={`${item.sourceId}-${index}`}>
                  <td>{item.medicationName}</td>
                  <td>{item.dosage}</td>
                  <td>{item.quantity}</td>
                  <td>{formatDate(item.occurrenceDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}