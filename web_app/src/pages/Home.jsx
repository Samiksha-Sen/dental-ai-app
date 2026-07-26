import { Sparkles, FilePlus, Layers, ShieldCheck, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Reveal from '@/components/site/Reveal';
import StatCounter from '@/components/site/StatCounter';

const FEATURES = [
  {
    icon: FilePlus,
    title: 'Dual-Model Triage',
    desc: 'An X-ray validity classifier filters out blank or non-dental images before the caries model ever runs, cutting false readings.',
  },
  {
    icon: Layers,
    title: 'Live Patient EHR',
    desc: "Every scan writes straight to a patient's diagnostic timeline — searchable, shareable, and synced across your team.",
  },
  {
    icon: ShieldCheck,
    title: 'Clinic-Grade Security',
    desc: 'Row-level access controls on every patient record, HIPAA-aligned audit logging, and encrypted transport end to end.',
  },
  {
    icon: LineChart,
    title: 'Practice Analytics',
    desc: 'Track caries prevalence, screening volume, and follow-up rates across your patient roster in one dashboard.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The validity check alone saved us from a dozen misfired diagnoses on blurry intraoral shots. It's the detail that shows this was built by people who've actually read X-rays.",
    name: 'Dr. Anjali Mehta',
    role: 'General Dentist, Mumbai',
    initials: 'AM',
  },
  {
    quote:
      'Confidence scoring gives my junior associates a second opinion they can actually reason about, not just a black-box yes/no.',
    name: 'Dr. Rohan Kapoor',
    role: 'Clinic Director, Apex Dental',
    initials: 'RK',
  },
  {
    quote:
      "The EHR timeline turned our patient follow-ups from a spreadsheet nightmare into something our front desk can actually manage.",
    name: 'Dr. Sana Noor',
    role: 'Pediatric Dentist, Bright Dental',
    initials: 'SN',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(99,102,241,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(6,182,212,0.14) 0%, transparent 45%), radial-gradient(circle at 50% 90%, rgba(124,58,237,0.12) 0%, transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <Reveal className="flex justify-center">
            <Badge variant="outline" className="mb-6 gap-1.5 border-border bg-white/5 py-1.5 text-[#22d3ee]">
              <Sparkles className="size-3" />
              Trusted clinical AI, built for dental practices
            </Badge>
          </Reveal>

          <Reveal delay={80}>
            <svg
              viewBox="0 0 120 120"
              className="mx-auto mb-8 w-40 drop-shadow-[0_0_40px_rgba(99,102,241,0.45)]"
              fill="none"
            >
              <defs>
                <linearGradient id="toothGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path
                d="M60 12C40 12 26 24 26 44c0 12 4 19 6.5 28 2.5 9 4.5 20 4.5 36 0 8 4.5 14 9.5 14 5 0 8-4.5 9-11.5C57 100 58 90 60 90s3 10 4.5 20.5c1 7 4 11.5 9 11.5 5 0 9.5-6 9.5-14 0-16 2-27 4.5-36C90 63 94 56 94 44 94 24 80 12 60 12Z"
                stroke="url(#toothGrad)"
                strokeWidth="3"
                fill="rgba(99,102,241,0.08)"
              />
            </svg>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-balance md:text-6xl">
              Detect caries before your patients feel it
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              DentalAI pairs an X-ray validity check with a trained caries classifier to give clinicians a
              confidence-scored second opinion in seconds — plugged straight into your patient EHR.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
                <a href="/dashboard-demo">Launch Live Demo</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/5">
                <a href="/ai-technology">See How It Works</a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCounter value={48200} suffix="+" label="X-Rays Scanned" />
              <StatCounter value={94.6} decimals={1} suffix="%" label="Model Accuracy" />
              <StatCounter value={120} suffix="+" label="Partner Clinics" />
              <StatCounter value={9500} suffix="+" label="Patients Tracked" />
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-14 flex flex-wrap justify-center gap-10 opacity-70">
              {['APEX DENTAL DIAGNOSTICS', 'ORAL HEALTH NETWORK', 'SMILE CARE GROUP', 'BRIGHT DENTAL PARTNERS'].map(
                (t) => (
                  <span key={t} className="text-xs font-bold tracking-wide text-muted-foreground">
                    {t}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why DentalAI */}
      <section className="px-6 py-24">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">Why DentalAI</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
            Clinical-grade AI, built into your existing workflow
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Every scan runs through a two-stage pipeline before a diagnosis ever reaches a patient's chart.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 60}>
              <Card className="h-full border-border bg-white/5 p-7 transition-all hover:-translate-y-1 hover:border-primary/40">
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-white/8 text-[#22d3ee]">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 px-6 py-24">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">What clinicians say</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">Built alongside dental practitioners</h2>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 60}>
              <Card className="h-full border-border bg-white/5 p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-xs font-bold text-white">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24">
        <Reveal
          className="mx-auto max-w-3xl rounded-3xl border border-border p-14 text-center bg-[linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.1))]"
        >
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">
            See it on a real X-ray in under a minute
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            No install required — the live dashboard demo runs the same models as the production clinical portal.
          </p>
          <Button size="lg" asChild className="mt-7 shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
            <a href="/dashboard-demo">Launch Live Demo</a>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
