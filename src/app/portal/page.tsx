import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { requirePatient } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildUpcomingAppointments, buildUpcomingRefills, filterNext7Days } from "@/lib/portal";

export default async function PortalPage() {
  const patient = await requirePatient();
  const fullPatient = await db.patient.findUniqueOrThrow({ where: { id: patient.id }, include: { appointments: true, prescriptions: true } });
  const upcomingAppointments = buildUpcomingAppointments(fullPatient.appointments);
  const upcomingRefills = buildUpcomingRefills(fullPatient.prescriptions);
  const next7Appointments = filterNext7Days(upcomingAppointments);
  const next7Refills = filterNext7Days(upcomingRefills);

  return (
    <div className="grid grid-3">
      <section className="panel stack">
        <div className="badge">Patient</div>
        <h2>{fullPatient.name}</h2>
        <div className="small">{fullPatient.email}</div>
        <form action={logoutAction}><button type="submit" className="secondary">Log out</button></form>
      </section>
      <section className="panel stack">
        <div className="space-between"><h2>Appointments in next 7 days</h2><Link href="/portal/appointments">View all</Link></div>
        {next7Appointments.length ? <ul className="clean">{next7Appointments.map((item) => <li key={item.id} className="item"><strong>{item.label}</strong><div className="small">{item.subtitle}</div></li>)}</ul> : <p>No appointments in the next 7 days.</p>}
      </section>
      <section className="panel stack">
        <div className="space-between"><h2>Refills in next 7 days</h2><Link href="/portal/prescriptions">View all</Link></div>
        {next7Refills.length ? <ul className="clean">{next7Refills.map((item) => <li key={item.id} className="item"><strong>{item.label}</strong><div className="small">{item.subtitle}</div></li>)}</ul> : <p>No refills in the next 7 days.</p>}
      </section>
    </div>
  );
}
