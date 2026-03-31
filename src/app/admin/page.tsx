import Link from "next/link";
import { db } from "@/lib/db";
import { buildUpcomingAppointments, buildUpcomingRefills } from "@/lib/portal";

export default async function AdminPage() {
  const patients = await db.patient.findMany({ orderBy: { createdAt: "desc" }, include: { appointments: true, prescriptions: true } });
  return (
    <section className="panel stack">
      <div className="space-between"><div><div className="badge">Mini-EMR</div><h2 style={{ marginTop: 12 }}>Patients</h2></div><Link href="/admin/patients/new">Create patient</Link></div>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Next appointment</th><th>Next refill</th><th>Actions</th></tr></thead>
        <tbody>
          {patients.map((patient) => {
            const nextAppointment = buildUpcomingAppointments(patient.appointments, 3)[0];
            const nextRefill = buildUpcomingRefills(patient.prescriptions, 3)[0];
            return <tr key={patient.id}><td>{patient.name}</td><td>{patient.email}</td><td>{nextAppointment?.subtitle ?? "—"}</td><td>{nextRefill?.subtitle ?? "—"}</td><td><Link href={`/admin/patients/${patient.id}`}>Open</Link></td></tr>;
          })}
        </tbody>
      </table>
    </section>
  );
}
