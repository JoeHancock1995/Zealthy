import Link from "next/link";
import { addDays, addMonths } from "date-fns";
import { db } from "@/lib/db";
import { requirePatientSession } from "@/lib/auth";
import { expandAppointments, expandPrescriptions } from "@/lib/portal";
import { logoutPatient } from "./actions";

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function logout() {
  "use server";

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/logout`, {
    method: "POST",
  }).catch(() => null);

  if (!response?.ok) {
    const { clearPatientSession } = await import("@/lib/auth");
    await clearPatientSession();
  }

  const { redirect } = await import("next/navigation");
  redirect("/");
}

export default async function PortalPage() {
  const patientId = await requirePatientSession();

  const patient = await db.patient.findUnique({
    where: { id: patientId },
    include: {
      appointments: true,
      prescriptions: true,
    },
  });

  if (!patient) {
    const { redirect } = await import("next/navigation");
    redirect("/");
  }

  const now = new Date();
  const next7Days = addDays(now, 7);
  const next3Months = addMonths(now, 3);

  const upcomingAppointments7Days = expandAppointments(
    patient.appointments,
    now,
    next7Days,
  );

  const upcomingRefills7Days = expandPrescriptions(
    patient.prescriptions,
    now,
    next7Days,
  );

  const upcomingAppointments3Months = expandAppointments(
    patient.appointments,
    now,
    next3Months,
  );

  const upcomingRefills3Months = expandPrescriptions(
    patient.prescriptions,
    now,
    next3Months,
  );

  return (
    <main>
      <div className="space-between" style={{ marginBottom: 20 }}>
        <div>
          <span className="">Patient Portal</span>
          <h1 style={{ marginTop: 12 }}>Welcome, {patient.name}</h1>
          <p>Your summary for the next 7 days.</p>
        </div>

        <form action={logoutPatient} className="inline">
          <button type="submit" className="secondary" style={{ width: "auto" }}>
            Log Out
          </button>
        </form>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 20 }}>
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
          </div>
        </section>

        <section className="card">
          <div className="stack">
            <h3>Appointments in 7 Days</h3>
            <div>{upcomingAppointments7Days.length}</div>
            <Link href="/portal/appointments">View full appointment schedule</Link>
          </div>
        </section>

        <section className="card">
          <div className="stack">
            <h3>Refills in 7 Days</h3>
            <div>{upcomingRefills7Days.length}</div>
              <Link href="/portal/prescriptions">View all prescriptions</Link> 
            </div>
        </section>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <div className="space-between" style={{ marginBottom: 12 }}>
            <h2>Upcoming Appointments</h2>
            <Link href="/portal/appointments">See all</Link>
          </div>

          {upcomingAppointments7Days.length === 0 ? (
            <p>No appointments in the next 7 days.</p>
          ) : (
            <ul className="clean">
              {upcomingAppointments7Days.slice(0, 5).map((item, index) => (
                <li className="item" key={`${item.sourceId}-${index}`}>
                  <div className="stack">
                    <strong>{item.providerName}</strong>
                    <span className="small">{formatDate(item.occurrenceDate)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="space-between" style={{ marginBottom: 12 }}>
            <h2>Upcoming Refills</h2>
            <Link href="/portal/prescriptions">See all</Link>
          </div>

          {upcomingRefills7Days.length === 0 ? (
            <p>No refills in the next 7 days.</p>
          ) : (
            <ul className="clean">
              {upcomingRefills7Days.slice(0, 5).map((item, index) => (
                <li className="item" key={`${item.sourceId}-${index}`}>
                  <div className="stack">
                    <strong>
                      {item.medicationName} ({item.dosage})
                    </strong>
                    <span className="small">
                      Qty {item.quantity} • {formatDate(item.occurrenceDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card" style={{ marginTop: 20 }}>
        <div className="grid grid-2">
          <div className="stack">
            <h3>Next 3 Months</h3>
            <div>
              <div className="small">Appointments scheduled</div>
              <div>{upcomingAppointments3Months.length}</div>
            </div>
          </div>

          <div className="stack">
            <h3>Next 3 Months</h3>
            <div>
              <div className="small">Refills scheduled</div>
              <div>{upcomingRefills3Months.length}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}