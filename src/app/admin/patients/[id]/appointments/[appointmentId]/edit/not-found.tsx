import Link from "next/link";

export default function AppointmentNotFoundPage() {
    return (
        <main>
            <section className="card">
                <div className="stack">
                    <span className="badge">Admin / Patient / Appointments / Edit</span>
                    <h1>Appointment not found</h1>
                    <p>The appointment you tried to edit does not exist.</p>
                    <Link href="/admin">
                        <button type="button" style={{ width: "auto" }}>
                            Back to Patients
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}