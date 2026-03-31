import Link from "next/link";

export default function EditPatientNotFoundPage() {
    return (
        <main>
            <section className="card">
                <div className="stack">
                    <span className="badge">Admin / Patient / Edit</span>
                    <h1>Patient not found</h1>
                    <p>The patient you tried to edit does not exist.</p>

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