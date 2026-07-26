import { Sparkles, FileStack, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Reveal from '@/components/site/Reveal';

const PILLARS = [
  {
    icon: Sparkles,
    title: 'Our Mission',
    desc: 'Reduce missed and delayed caries diagnoses by putting a trained classification model directly into the clinical workflow, not a separate silo.',
  },
  {
    icon: FileStack,
    title: 'The Technology',
    desc: 'A dual-model pipeline — MobileNetV2 feature extraction feeding both an X-ray validity check and a purpose-trained caries classifier — served through a Flask API to both mobile and web clients.',
  },
  {
    icon: Users,
    title: 'Who It’s For',
    desc: "General dentists, clinic directors, and dental students who want a fast second opinion, not a replacement for professional judgment.",
  },
];

const TEAM = [
  { initials: 'SS', name: 'Dr. Samiksha Sen', role: 'Clinical Lead' },
  { initials: 'EN', name: 'Engineering Team', role: 'ML & Platform' },
  { initials: 'CA', name: 'Clinical Advisors', role: 'Dental Practice Network' },
];

export default function About() {
  return (
    <>
      <section className="px-6 pb-20 pt-24">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">Research / About</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
            Building a second pair of eyes for every dental clinic
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            DentalAI started as a diagnostic-support tool for practices without in-house radiology support — a way
            to give any clinician a fast, confidence-scored read on a dental X-ray before committing to treatment.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 60}>
              <Card className="h-full border-border bg-white/5 p-7">
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
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">Team</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">Clinicians and engineers, building together</h2>
        </Reveal>
        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-3">
          {TEAM.map((p, i) => (
            <Reveal key={p.name} delay={i * 60} className="text-center">
              <Avatar className="mx-auto mb-3 size-16">
                <AvatarFallback className="bg-gradient-to-br from-[#6366f1] to-[#7c3aed] text-lg font-bold text-white">
                  {p.initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-bold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.role}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <Reveal
          className="mx-auto max-w-3xl rounded-3xl border border-border p-14 text-center bg-[linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.1))]"
        >
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">Have questions about how it works?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Reach out — we're happy to walk through the model or the data handling in detail.
          </p>
          <Button size="lg" asChild className="mt-7 shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
            <a href="/contact">Contact Us</a>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
