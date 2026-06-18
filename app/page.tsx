"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const AuthButton = dynamic(() => import("./components/AuthButton"), { ssr: false });

const Home = () => {
  return (
    <main className="bg-background text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between gap-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
              <span className="text-lg font-semibold">JP</span>
            </div>
            <span className="text-lg font-semibold">JobPilot</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-text-dark md:flex">
            <a href="#" className="hover:text-accent">
              Dashboard
            </a>
            <a href="#" className="hover:text-accent">
              Find Jobs
            </a>
            <a href="#" className="hover:text-accent">
              Profile
            </a>
          </nav>

          {/* Auth-aware button: shows Sign out when signed in, otherwise links to login */}
          <AuthButton />
        </header>

        <section className="mt-8 overflow-hidden rounded-[32px] border border-border bg-surface p-8 shadow-[0_20px_80px_rgba(49,63,93,0.08)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-accent-light via-surface to-info-light opacity-60" />
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                JobPilot
              </p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] text-text-darkest sm:text-6xl">
                Job hunting is hard.
                <br />
                Your tools shouldn’t be.
              </h1>
              <p className="mt-6 max-w-xl text-base font-medium leading-7 text-text-secondary">
                Stop applying blind. JobPilot finds the jobs, researches the companies, and gives you everything you need to stand out.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-dark"
                >
                  Get Started
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary"
                >
                  Find Your First Match
                </a>
              </div>
            </div>

            <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
              <Image
                src="/images/dashboard-demo.png"
                alt="JobPilot dashboard preview"
                width={1200}
                height={760}
                className="h-auto w-full rounded-3xl"
              />
            </div>
          </div>
        </section>

        <section id="features" className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              Manage Your Job Search With Ease
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-text-darkest">
              Manage Your Job Search With Ease
            </h2>
            <div className="space-y-6 rounded-[28px] border border-border bg-surface p-8 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-text-darkest">Find jobs that actually fit</h3>
                <p className="mt-3 text-base leading-7 text-text-secondary">
                  Search by title and location or paste a job link. Get matched roles you can quickly scan.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-darkest">Know the Company Before You Apply</h3>
                <p className="mt-3 text-base leading-7 text-text-secondary">
                  Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-darkest">Keep track of every application</h3>
                <p className="mt-3 text-base leading-7 text-text-secondary">
                  Keep a clear view of every job you’ve found, tailored. Your activity and progress all stay in one simple place.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
            <Image
              src="/images/jobs-lists.png"
              alt="Job list preview"
              width={1200}
              height={900}
              className="h-auto w-full rounded-3xl"
            />
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
            <Image
              src="/images/agnet-log.png"
              alt="Agent log preview"
              width={1200}
              height={900}
              className="h-auto w-full rounded-3xl"
            />
          </div>
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              Apply With More Confidence, Every Time
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-text-darkest">
              Apply With More Confidence, Every Time
            </h2>
            <div className="space-y-6 rounded-[28px] border border-border bg-surface p-8 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-text-darkest">Understand your match score</h3>
                <p className="mt-3 text-base leading-7 text-text-secondary">
                  See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what’s missing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-darkest">AI-Powered Job Matching</h3>
                <p className="mt-3 text-base leading-7 text-text-secondary">
                  Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-darkest">Focus on the right roles</h3>
                <p className="mt-3 text-base leading-7 text-text-secondary">
                  Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[32px] border border-border bg-surface p-10 text-center shadow-[0_20px_80px_rgba(49,63,93,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            Success Stories
          </p>
          <h2 className="mt-6 text-3xl font-semibold leading-tight text-text-darkest sm:text-4xl">
            “I used to spend my evenings copy-pasting resumes. Now I open my dashboard to see interviews waiting. It feels like cheating. Had 3 offers on the table simultaneously.”
          </h2>
          <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-4 rounded-3xl border border-border bg-surface-secondary px-6 py-5">
            <Image
              src="/images/user-icon.png"
              alt="Tom Wilson"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="text-left">
              <p className="font-semibold text-text-darkest">Tom Wilson</p>
              <p className="text-sm text-text-secondary">Junior Developer</p>
            </div>
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[32px] bg-gradient-to-r from-accent-light via-surface-secondary to-info-light px-6 py-12 text-center sm:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-semibold leading-tight text-text-darkest sm:text-5xl">
              Your next job search can feel a lot less overwhelming
            </h2>
            <p className="mt-5 text-base leading-7 text-text-secondary">
              Set up your profile, upload your resume, and start finding matches in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-dark"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary"
              >
                Find Your First Match
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border py-6 text-sm text-text-secondary md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <span className="text-sm font-semibold">JP</span>
            </div>
            <span className="font-semibold text-text-dark">JobPilot</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
            <a href="#">Dashboard</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Home;
