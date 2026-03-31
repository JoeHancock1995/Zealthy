import { createPatientAction } from "./actions";

export default async function NewPatientPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <section className="panel stack">
      <h2>Create patient</h2>
      <p>Patient creation includes setting the password to make exercise testing easier.</p>
      {params.error ? <p className="error">{params.error}</p> : null}
      <form action={createPatientAction} className="grid grid-2">
        <label>Name<input name="name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" required minLength={8} /></label>
        <div className="row" style={{ gridColumn: "1 / -1" }}><button type="submit">Create patient</button></div>
      </form>
    </section>
  );
}
