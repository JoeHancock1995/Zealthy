export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "@/lib/db";

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminPage() {
  const patients = await db.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      appointments: {
        orderBy: { startDateTime: "asc" },
      },
      prescriptions: {
        orderBy: { refillDate: "asc" },
      },
    },
  });

  return (
    <main className="page">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Mini EMR</h1>
          <p className="subtext">Manage patients, appointments, and prescriptions.</p>
        </div>

        <Link href="/admin/patients/new" className="primaryButton">
          New Patient
        </Link>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Appointments</th>
              <th>Prescriptions</th>
              <th>Next Appointment</th>
              <th>Next Refill</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="emptyCell">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((patient) => {
                const nextAppointment = patient.appointments[0];
                const nextPrescription = patient.prescriptions[0];

                return (
                  <tr key={patient.id}>
                    <td>
                      <div className="cellStack">
                        <Link href={`/admin/patients/${patient.id}`} className="tableLink">
                          {patient.name}
                        </Link>
                        <span className="muted">Created {formatDate(patient.createdAt)}</span>
                      </div>
                    </td>

                    <td>{patient.email}</td>

                    <td>{patient.appointments.length}</td>

                    <td>{patient.prescriptions.length}</td>

                    <td>
                      {nextAppointment
                        ? `${nextAppointment.providerName} • ${formatDate(nextAppointment.startDateTime)}`
                        : "—"}
                    </td>

                    <td>
                      {nextPrescription
                        ? `${nextPrescription.medicationName} • ${formatDate(nextPrescription.refillDate)}`
                        : "—"}
                    </td>

                    <td>
                      <div className="actionGroup">
                        <Link href={`/admin/patients/${patient.id}`} className="secondaryButton">
                          View
                        </Link>
                        <Link
                          href={`/admin/patients/${patient.id}/edit`}
                          className="secondaryButton"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}