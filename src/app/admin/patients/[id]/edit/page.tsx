import { updatePatientAction } from "@/app/actions";
import { db } from "@/lib/db";

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await db.patient.findUniqueOrThrow({ where: { id } });
  const boundAction = updatePatientAction.bind(null, id);
  return (
    <section className="panel stack">
      <h2>Edit patient</h2>
      <form action={boundAction} className="grid grid-2">
        <label>Name<input name="name" defaultValue={patient.name} required /></label>
        <label>Email<input name="email" type="email" defaultValue={patient.email} required /></label>
        <label>New password<input name="password" type="password" placeholder="Leave blank to keep current password" /></label>
        <div className="row" style={{ gridColumn: "1 / -1" }}><button type="submit">Save changes</button></div>
      </form>
    </section>
  );
}
