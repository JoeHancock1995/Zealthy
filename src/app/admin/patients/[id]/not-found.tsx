import Link from "next/link";

export default function PatientNotFoundPage() {
    return (
        <main>
            <section className="card">
                <div className="stack">
                    <span className="badge">Admin / Patient</span>
                    <h1>Patient not found</h1>
                    <p>The patient record you tried to open does not exist.</p>

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