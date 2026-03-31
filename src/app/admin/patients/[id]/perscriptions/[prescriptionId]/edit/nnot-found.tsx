import Link from "next/link";

export default function PrescriptionNotFoundPage() {
    return (
        <main>
            <section className="card">
                <div className="stack">
                    <span className="badge">Admin / Patient / Prescriptions / Edit</span>
                    <h1>Prescription not found</h1>
                    <p>The prescription you tried to edit does not exist.</p>
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