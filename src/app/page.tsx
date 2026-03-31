"use client";

import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      window.location.href = "/portal";
      return;
    }

    const data = await response.json().catch(() => null);
    setError(data?.error ?? "Unable to log in.");
    setLoading(false);
  }

  return (
    <main>
      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <section className="card">
          <div className="stack">
            <span className="badge">Patient Portal</span>
            <h1>Log in</h1>
            <p>
              Sign in to view your upcoming appointments, medication refills, and
              patient information.
            </p>

            <form onSubmit={handleSubmit} className="stack">
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="patient@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </label>

              {error ? <div className="error">{error}</div> : null}

              <div className="row">
                <button type="submit" disabled={loading} style={{ width: "auto" }}>
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="card">
          <div className="stack">
            <h2>What patients can view</h2>
            <ul className="clean">
              <li className="item">Appointments within the next 7 days</li>
              <li className="item">Medication refills within the next 7 days</li>
              <li className="item">Full upcoming appointment schedule</li>
              <li className="item">All prescriptions and refill schedule</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}