"use client";
import { useState } from "react";
import insforgeClient from "../../lib/insforge-client";
import { posthog } from "@/lib/posthog-client";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleOAuthLogin(provider: "google" | "github") {
    setError(null);
    posthog.capture("login_oauth_clicked", { provider });
    try {
      const startResp = await fetch(
        `/api/auth/oauth/start?provider=${encodeURIComponent(provider)}&redirectTo=${encodeURIComponent(
          `${window.location.origin}/dashboard`
        )}`
      );

      const json = await startResp.json();
      if (!startResp.ok) {
        setError(json?.error || 'Failed to start OAuth sign-in. Please try again later.');
        return;
      }

      const url = json?.url;
      if (!url) {
        setError('No auth URL returned by provider. Try again later.');
        setShowFallback(true);
        return;
      }

      // Navigate to provider URL
      window.location.href = url;
    } catch (err: any) {
      setError(err?.message || String(err) || 'An unexpected error occurred.');
      setShowFallback(true);
    }
  }

  async function handlePasswordSignIn(e?: any) {
    if (e) e.preventDefault();
    setError(null);
    posthog.capture("login_email_attempt", {
      email_provided: Boolean(email),
    });
    try {
      const res = await insforgeClient.auth.signInWithPassword({
        email,
        password,
        redirectTo: `${window.location.origin}/dashboard`,
      } as any);

      if (res.error) {
        posthog.capture("login_email_failed", {
          reason: res.error.message,
        });
        setError(res.error.message || 'Password sign-in failed');
        return;
      }

      posthog.capture("login_email_success");
      // If SDK performed redirect, the browser will navigate automatically.
      // Otherwise, redirect client-side.
      window.location.href = `${window.location.origin}/dashboard`;
    } catch (err: any) {
      posthog.capture("login_email_failed", {
        reason: err?.message || String(err),
      });
      setError(err?.message || String(err) || 'An unexpected error occurred.');
    }
  }

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto grid min-h-screen max-w-[1200px] grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="flex flex-col justify-center rounded-[32px] border border-border bg-surface p-10 shadow-sm lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-accent">JobPilot</p>
          <h1 className="mt-8 text-4xl font-semibold leading-tight text-text-darkest sm:text-5xl">
            Sign in with your preferred account
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary">
            Continue instantly with Google or GitHub to access your dashboard, review job matches, and manage applications.
          </p>
          <div className="mt-10 grid gap-6 rounded-[28px] bg-surface-secondary p-8 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-text-darkest">Why JobPilot?</h2>
              <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                <li>• Automatically match your profile to the best roles.</li>
                <li>• Get personalized job recommendations and company insights.</li>
                <li>• Track applications and stay organized in one place.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-background p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Fast access</p>
              <p className="mt-3 text-sm text-text-secondary">No passwords to remember. Sign in securely with OAuth and get back to your job search faster.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[32px] border border-border bg-surface p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold text-text-darkest">Sign in to JobPilot</h2>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
                >
                  <span>Continue with Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("github")}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
                >
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

              {showFallback && (
                <form onSubmit={handlePasswordSignIn} className="mt-4 space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full rounded-md border border-border px-3 py-2"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full rounded-md border border-border px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"
                  >
                    Sign in with email
                  </button>
                </form>
              )}

              <div className="rounded-2xl border border-border bg-surface-secondary p-4 text-sm text-text-secondary">
                <p>Need a new account?</p>
                <a href="/signup" className="text-accent underline">Create one here</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
