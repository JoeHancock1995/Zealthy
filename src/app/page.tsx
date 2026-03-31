import { loginAction } from "@/app/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="grid grid-2">
      <section className="panel stack">
        <div>
          <div className="badge">Patient Portal</div>
          <h2 style={{ marginTop: 12 }}>Log in</h2>
          <p>Use one of the seeded sample users or a patient you create through the admin interface.</p>
        </div>
        {params.error ? <p className="error">{params.error}</p> : null}
        <form action={loginAction} className="stack">
          <label>Email<input name="email" type="email" placeholder="mark@some-email-provider.net" required /></label>
          <label>Password<input name="password" type="password" placeholder="Password123!" required /></label>
          <button type="submit">Log in</button>
        </form>
      </section>
      <section className="panel stack">
        <div><div className="badge">Quick start</div><h2 style={{ marginTop: 12 }}>Sample credentials</h2></div>
        <ul className="clean">
          <li className="item"><strong>Mark Johnson</strong><div className="small">mark@some-email-provider.net / Password123!</div></li>
          <li className="item"><strong>Lisa Smith</strong><div className="small">lisa@some-email-provider.net / Password123!</div></li>
        </ul>
        <p>Admin is intentionally open at <a href="/admin">/admin</a> to match the exercise prompt.</p>
      </section>
    </div>
  );
}
