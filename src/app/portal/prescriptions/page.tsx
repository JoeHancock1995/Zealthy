import { requirePatient } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildUpcomingRefills } from "@/lib/portal";

export default async function PortalPrescriptionsPage() {
  const patient = await requirePatient();
  const data = await db.patient.findUniqueOrThrow({ where: { id: patient.id }, include: { prescriptions: true } });
  const refills = buildUpcomingRefills(data.prescriptions);
  return (
    <section className="panel stack">
      <h2>Upcoming prescriptions and refills</h2>
      <p>Showing generated refill schedule occurrences up to 3 months ahead.</p>
      <ul className="clean">{refills.map((item) => <li key={item.id} className="item"><strong>{item.label}</strong><div className="small">{item.subtitle}</div></li>)}</ul>
    </section>
  );
}
