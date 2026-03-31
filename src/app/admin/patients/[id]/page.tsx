import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import "./patient-detail.css";

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

export default async function PatientDetailPage({
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
      prescriptions: {
        orderBy: { refillDate: "asc" },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  const nextAppointment = patient.appointments[0];
  const nextPrescription = patient.prescriptions[0];

  return (
    <main>
      <div className="space-between mb-20">
        <div>
          <span className="badge">Admin / Patient</span>
          <h1 className="mt-12">{patient.name}</h1>
          <p>{patient.email}</p>
        </div>

        <div className="row">
          <Link href="/admin">
            <button type="button" className="secondary btn-auto">
              Back to Patients
            </button>
          </Link>

          <Link href={`/admin/patients/${patient.id}/edit`}>
            <button type="button" className="btn-auto">
              Edit Patient
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-3 mb-20">
        <section className="card">
          <div className="stack">
            <h3>Patient Info</h3>
            <div>
              <div className="small">Name</div>
              <div>{patient.name}</div>
            </div>
            <div>
              <div className="small">Email</div>
              <div>{patient.email}</div>
            </div>
            <div>
              <div className="small">Created</div>
              <div>{formatDate(patient.createdAt)}</div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="stack">
            <h3>Appointments</h3>
            <div>
              <div className="small">Total</div>
              <div>{patient.appointments.length}</div>
            </div>
            <div>
              <div className="small">Next Appointment</div>
              <div>
                {nextAppointment
                  ? `${nextAppointment.providerName} — ${formatDate(
                    nextAppointment.startDateTime,
                  )}`
                  : "—"}
              </div>
            </div>
            <Link href={`/admin/patients/${patient.id}/appointments`}>
              <button type="button">Manage Appointments</button>
            </Link>
          </div>
        </section>

        <section className="card">
          <div className="stack">
            <h3>Prescriptions</h3>
            <div>
              <div className="small">Total</div>
              <div>{patient.prescriptions.length}</div>
            </div>
            <div>
              <div className="small">Next Refill</div>
              <div>
                {nextPrescription
                  ? `${nextPrescription.medicationName} — ${formatDate(
                    nextPrescription.refillDate,
                  )}`
                  : "—"}
              </div>
            </div>
            <Link href={`/admin/patients/${patient.id}/prescriptions`}>
              <button type="button">Manage Prescriptions</button>
            </Link>
          </div>
        </section>
      </div>

      <section className="card mb-20">
        <div className="space-between mb-16">
          <div>
            <h2>Appointments</h2>
            <p>Upcoming and recurring appointment records for this patient.</p>
          </div>

          <Link href={`/admin/patients/${patient.id}/appointments`}>
            <button type="button" className="btn-auto">
              Add / Manage
            </button>
          </Link>
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
              </tr>
            </thead>
            <tbody>
              {patient.appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.providerName}</td>
                  <td>{formatDate(appointment.startDateTime)}</td>
                  <td>{formatRepeatSchedule(appointment.repeatSchedule)}</td>
                  <td>{formatDate(appointment.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <div className="space-between mb-16">
          <div>
            <h2>Prescriptions</h2>
            <p>Active medication records and refill schedules.</p>
          </div>

          <Link href={`/admin/patients/${patient.id}/prescriptions`}>
            <button type="button" className="btn-auto">
              Add / Manage
            </button>
          </Link>
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
              </tr>
            </thead>
            <tbody>
              {patient.prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td>{prescription.medicationName}</td>
                  <td>{prescription.dosage}</td>
                  <td>{prescription.quantity}</td>
                  <td>{formatDate(prescription.refillDate)}</td>
                  <td>{formatRepeatSchedule(prescription.refillSchedule)}</td>
                  <td>{formatDate(prescription.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}