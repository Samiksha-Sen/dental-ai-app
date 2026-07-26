import { FileStack, ClipboardList, ShieldCheck, BarChart3, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/site/Reveal';

const FEATURES = [
  {
    icon: FileStack,
    title: 'AI Caries Diagnosis',
    desc: 'A trained classifier scores each X-ray for demineralization and caries presence, returning a confidence percentage and a clinical recommendation — restorative treatment or routine check-up.',
  },
  {
    icon: ClipboardList,
    title: 'Electronic Health Records',
    desc: 'Every patient gets a running diagnostic timeline — registrations, scans, and follow-ups, all searchable and shared across your clinical team via a live Supabase-backed record store.',
  },
  {
    icon: ShieldCheck,
    title: 'Security & Access Control',
    desc: 'Row-level security policies scope every patient record, clinician sessions are logged for HIPAA-aligned auditing, and all traffic between the app and backend is encrypted.',
  },
  {
    icon: BarChart3,
    title: 'Practice Analytics',
    desc: 'See screening volume, caries prevalence by age group, and follow-up completion rate at a glance — the same data model that powers the in-app clinical dashboard.',
  },
  {
    icon: MessageSquare,
    title: 'AI Clinical Assistant',
    desc: 'An in-app chat companion answers quick clinical questions about a scanned tooth — treatment alternatives, extraction risk, and next steps.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Tunable Sensitivity',
    desc: "Adjust the classifier's confidence threshold per clinic — from a conservative 95% high-sensitivity mode down to a broader 75% screening pass.",
  },
];

export default function Features() {
  return (
    <>
      <section className="px-6 pb-20 pt-24">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">Features</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
            Everything a clinical screening workflow needs
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            From AI diagnosis to electronic health records, security, and practice-level analytics.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="bg-muted/40 px-6 py-24">
        <Reveal
          className="mx-auto max-w-3xl rounded-3xl border border-border p-14 text-center bg-[linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.1))]"
        >
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">
            Ready to see it running on a real scan?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            The live dashboard demo runs the exact same pipeline described here.
          </p>
          <Button size="lg" asChild className="mt-7 shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
            <a href="/dashboard-demo">Launch Live Demo</a>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
