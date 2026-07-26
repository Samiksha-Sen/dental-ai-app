import { useState } from 'react';
import { toast } from 'sonner';
import { PhoneCall, Code2, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Reveal from '@/components/site/Reveal';

const FAQS = [
  {
    q: 'Is DentalAI a replacement for a dentist’s diagnosis?',
    a: "No. It's a decision-support tool that gives a confidence-scored second read on an X-ray. Every result is meant to be reviewed by a licensed clinician before treatment decisions are made.",
  },
  {
    q: 'What image formats are supported?',
    a: 'Standard PNG and JPG dental X-ray images. The validity check will reject non-dental photos and blank or corrupted uploads automatically.',
  },
  {
    q: 'Where is patient data stored?',
    a: "Patient records and diagnostic history are stored in your clinic's Supabase project, shared between the mobile app and this web portal so records stay in sync.",
  },
  {
    q: 'Can I adjust how sensitive the model is?',
    a: 'Yes — the confidence threshold is configurable per clinic, from a conservative 95% high-sensitivity mode down to a broader 75% screening pass.',
  },
  {
    q: 'Does the live demo on this site use the real model?',
    a: "Yes — the Dashboard Demo page talks to the same Flask /predict endpoint and TensorFlow models used by the production mobile app.",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent — we'll follow up by email.");
    e.target.reset();
  };

  return (
    <>
      <section className="px-6 pb-16 pt-24">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">Contact</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">Get in touch</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Questions about deployment, the model pipeline, or a partner clinic integration — send us a note.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <Reveal>
            <Card className="border-border bg-white/5 p-7">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cf-name">Full Name</Label>
                  <Input id="cf-name" name="name" placeholder="Dr. Jane Doe" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cf-email">Email</Label>
                  <Input id="cf-email" type="email" name="email" placeholder="jane@clinic.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cf-clinic">Clinic / Organization</Label>
                  <Input id="cf-clinic" name="clinic" placeholder="Apex Dental Diagnostics" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cf-message">Message</Label>
                  <Textarea id="cf-message" name="message" rows={5} placeholder="Tell us what you're looking for..." required />
                </div>
                <Button type="submit" className="w-full shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
                  Send Message
                </Button>
                {submitted && (
                  <p className="text-center text-xs text-[#10b981]">Thanks — your message has been noted.</p>
                )}
              </form>
            </Card>
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-5">
            <Card className="border-border bg-white/5 p-7">
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-white/8 text-[#22d3ee]">
                <PhoneCall className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold">Clinical Support</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                For deployment questions or clinic onboarding, reach the clinical support team directly.
              </p>
            </Card>
            <Card className="border-border bg-white/5 p-7">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-11 items-center justify-center rounded-lg bg-white/8 text-[#22d3ee]">
                  <Code2 className="size-5" />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-4 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>See AI Technology for the full pipeline breakdown.</TooltipContent>
                </Tooltip>
              </div>
              <h3 className="font-heading text-base font-bold">Technical / API</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Questions about the <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/predict</code>{' '}
                endpoint, model thresholds, or Supabase data schema.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <Separator className="mx-auto max-w-4xl" />

      <section className="bg-muted/40 px-6 py-24">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">FAQ</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">Frequently asked questions</h2>
        </Reveal>

        <Reveal className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-white/5 px-5"
              >
                <AccordionTrigger className="text-sm font-bold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
    </>
  );
}
