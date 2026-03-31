export const dynamic = "force-dynamic";
import Link from "next/link";
import { addMonths } from "date-fns";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePatientSession } from "@/lib/auth";
import { expandAppointments } from "@/lib/portal";

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

export default async function PortalAppointmentsPage() {
  const patientId = await requirePatientSession();

  const patient = await db.patient.findUnique({
    where: { id: patientId },
    include: {
      appointments: {
        orderBy: { startDateTime: "asc" },
      },
    },
  });

  if (!patient) {
    redirect("/");
  }

  const now = new Date();
  const next3Months = addMonths(now, 3);
  const occurrences = expandAppointments(patient.appointments, now, next3Months);

  return (
    <main>
      <div className="space-between" style={{ marginBottom: 20 }}>
        <div>
          <span className="badge">Patient Portal / Appointments</span>
          <h1 style={{ marginTop: 12 }}>Upcoming Appointments</h1>
          <p>All appointment occurrences scheduled in the next 3 months.</p>
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

      <section className="card">
        {occurrences.length === 0 ? (
          <p>No upcoming appointments in the next 3 months.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Occurrence Date</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {occurrences.map((item, index) => {
                const source = patient.appointments.find((a) => a.id === item.sourceId);

                return (
                  <tr key={`${item.sourceId}-${index}`}>
                    <td>{item.providerName}</td>
                    <td>{formatDate(item.occurrenceDate)}</td>
                    <td>{formatRepeatSchedule(source?.repeatSchedule ?? "none")}</td>
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