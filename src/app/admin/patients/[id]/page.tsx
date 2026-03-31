import Link from "next/link";
import { deleteAppointmentAction, deletePrescriptionAction, createAppointmentAction, createPrescriptionAction } from "@/app/actions";
import { db } from "@/lib/db";

export default async function PatientDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const patient = await db.patient.findUniqueOrThrow({ where: { id }, include: { appointments: true, prescriptions: true } });
  const medicationOptions = await db.medicationOption.findMany({ orderBy: { name: "asc" } });
  const dosageOptions = await db.dosageOption.findMany({ orderBy: { value: "asc" } });
  const addAppointment = createAppointmentAction.bind(null, id);
  const addPrescription = createPrescriptionAction.bind(null, id);

  return (
    <div className="grid grid-2">
      <section className="panel stack">
        <div className="space-between">
          <div><div className="badge">Patient</div><h2 style={{ marginTop: 12 }}>{patient.name}</h2><div className="small">{patient.email}</div></div>
          <Link href={`/admin/patients/${patient.id}/edit`}>Edit</Link>
        </div>
        {query.error ? <p className="error">{query.error}</p> : null}
        <div className="stack">
          <h3>Appointments</h3>
          <ul className="clean">
            {patient.appointments.map((appointment) => (
              <li key={appointment.id} className="item">
                <div className="space-between">
                  <div>
                    <strong>{appointment.providerName}</strong>
                    <div className="small">Starts {appointment.startDateTime.toLocaleString()}</div>
                    <div className="small">Repeat: {appointment.repeatSchedule}</div>
                  </div>
                  <form action={deleteAppointmentAction.bind(null, patient.id, appointment.id)}><button type="submit" className="danger">Delete</button></form>
                </div>
              </li>
            ))}
          </ul>
          <form action={addAppointment} className="grid grid-2">
            <label>Provider name<input name="providerName" required /></label>
            <label>First appointment date/time<input name="startDateTime" type="datetime-local" required /></label>
            <label>Repeat schedule<select name="repeatSchedule" defaultValue="none"><option value="none">None</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>
            <label>End recurring on<input name="endDate" type="date" /></label>
            <div className="row" style={{ gridColumn: "1 / -1" }}><button type="submit">Add appointment</button></div>
          </form>
        </div>
      </section>
      <section className="panel stack">
        <div className="stack">
          <h3>Prescriptions</h3>
          <ul className="clean">
            {patient.prescriptions.map((prescription) => (
              <li key={prescription.id} className="item">
                <div className="space-between">
                  <div>
                    <strong>{prescription.medicationName} {prescription.dosage}</strong>
                    <div className="small">Quantity: {prescription.quantity}</div>
                    <div className="small">First refill: {prescription.refillDate.toLocaleDateString()}</div>
                    <div className="small">Repeat: {prescription.refillSchedule}</div>
                  </div>
                  <form action={deletePrescriptionAction.bind(null, patient.id, prescription.id)}><button type="submit" className="danger">Delete</button></form>
                </div>
              </li>
            ))}
          </ul>
          <form action={addPrescription} className="grid grid-2">
            <label>Medication<select name="medicationName" required>{medicationOptions.map((option) => <option key={option.id} value={option.name}>{option.name}</option>)}</select></label>
            <label>Dosage<select name="dosage" required>{dosageOptions.map((option) => <option key={option.id} value={option.value}>{option.value}</option>)}</select></label>
            <label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required /></label>
            <label>First refill date<input name="refillDate" type="date" required /></label>
            <label>Refill schedule<select name="refillSchedule" defaultValue="monthly"><option value="none">None</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>
            <label>End recurring on<input name="endDate" type="date" /></label>
            <div className="row" style={{ gridColumn: "1 / -1" }}><button type="submit">Add prescription</button></div>
          </form>
        </div>
      </section>
    </div>
  );
}
