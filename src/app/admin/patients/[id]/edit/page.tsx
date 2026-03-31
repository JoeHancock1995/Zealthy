export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updatePatient } from "./actions";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patient = await db.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    notFound();
  }

  const updatePatientWithId = updatePatient.bind(null, patient.id);

  return (
    <main>
      <div className="space-between" style={{ marginBottom: 20 }}>
        <div>
          <span className="badge">Admin / Patient / Edit</span>
          <h1 style={{ marginTop: 12 }}>Edit Patient</h1>
          <p>Update the patient’s basic information and optional password.</p>
        </div>

        <div className="row">
          <Link href={`/admin/patients/${patient.id}`}>
            <button type="button" className="secondary" style={{ width: "auto" }}>
              Back to Patient
            </button>
          </Link>

          <Link href="/admin">
            <button type="button" className="secondary" style={{ width: "auto" }}>
              Back to Patients
            </button>
          </Link>
        </div>
      </div>

      <section className="card" style={{ maxWidth: 720 }}>
        <form action={updatePatientWithId} className="stack">
          <label>
            Name
            <input
              name="name"
              type="text"
              defaultValue={patient.name}
              required
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              defaultValue={patient.email}
              required
            />
          </label>

          <label>
            New Password
            <input
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
            />
          </label>

          <p className="small">
            Leave the password field empty if you do not want to change it.
          </p>

          <div className="row">
            <button type="submit" style={{ width: "auto" }}>
              Save Changes
            </button>

            <Link href={`/admin/patients/${patient.id}`}>
              <button type="button" className="secondary" style={{ width: "auto" }}>
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}