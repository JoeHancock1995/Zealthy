import Link from "next/link";

export default function PatientPrescriptionsNotFoundPage() {
    return (
        <main>
            <section className="card">
                <div className="stack">
                    <span className="badge">Admin / Patient / Prescriptions</span>
                    <h1>Patient not found</h1>
                    <p>The patient you tried to open does not exist.</p>

                    <div className="row">
                        <Link href="/admin">
                            <button type="button" style={{ width: "auto" }}>
                                Back to Patients
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}