import { requirePatient } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildUpcomingAppointments } from "@/lib/portal";

export default async function PortalAppointmentsPage() {
  const patient = await requirePatient();
  const data = await db.patient.findUniqueOrThrow({ where: { id: patient.id }, include: { appointments: true } });
  const appointments = buildUpcomingAppointments(data.appointments);
  return (
    <section className="panel stack">
      <h2>Upcoming appointments</h2>
      <p>Showing generated occurrences up to 3 months ahead.</p>
      <ul className="clean">{appointments.map((item) => <li key={item.id} className="item"><strong>{item.label}</strong><div className="small">{item.subtitle}</div></li>)}</ul>
    </section>
  );
}
