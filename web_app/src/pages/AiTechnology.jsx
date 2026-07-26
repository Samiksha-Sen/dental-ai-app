import { ArrowRight, ScanFace, ImageOff, Cpu, ShieldCheck, FileStack, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/site/Reveal';

const STEPS = [
  { icon: ScanFace, title: 'Integrity Check', desc: 'The uploaded file is verified as a valid, non-corrupted image before anything else runs.' },
  { icon: ImageOff, title: 'Blank-Scan Filter', desc: 'Pixel standard deviation is checked to reject flat or blank images before they waste a model pass.' },
  { icon: Cpu, title: 'Feature Extraction', desc: 'MobileNetV2 (ImageNet weights) extracts a pooled feature vector from the image.' },
  { icon: ShieldCheck, title: 'X-Ray Validation', desc: 'A binary classifier (xray_validator.h5) confirms the image is actually a dental X-ray, not an arbitrary photo.' },
  { icon: FileStack, title: 'Caries Classification', desc: 'If validated, caries_model1.h5 scores the X-ray for demineralization and caries presence.' },
  { icon: Gauge, title: 'Confidence & Recommendation', desc: "The score is compared against your clinic's threshold to return a condition, confidence %, and next step." },
];

export default function AiTechnology() {
  return (
    <>
      <section className="px-6 pb-20 pt-24">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">AI Technology</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
            What actually happens to an X-ray after you upload it
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Every image runs through the same six-stage pipeline, whether it comes from the mobile app, the clinical
            portal, or this website's live demo.
          </p>
        </Reveal>

        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-center">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex items-stretch">
                <Card className="m-2 w-[210px] border-border bg-white/5 p-6 text-center">
                  <div className="mx-auto mb-3 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed] text-xs font-extrabold text-white">
                    {i + 1}
                  </div>
                  <Icon className="mx-auto mb-2 size-5 text-[#22d3ee]" />
                  <h4 className="font-heading text-sm font-bold">{title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </Card>
                {i < STEPS.length - 1 && (
                  <div className="hidden items-center px-1 text-muted-foreground lg:flex">
                    <ArrowRight className="size-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-muted/40 px-6 py-24">
        <Reveal className="mx-auto mb-14 max-w-xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">Model Details</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">Two purpose-built models, one pipeline</h2>
        </Reveal>
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          <Reveal>
            <Card className="h-full border-border bg-white/5 p-7">
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-white/8 text-[#22d3ee]">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold">X-Ray Validator</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A binary classifier trained on top of MobileNetV2 features, deciding whether an uploaded image is a
                genuine dental X-ray before the diagnostic model ever sees it.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card className="h-full border-border bg-white/5 p-7">
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-white/8 text-[#22d3ee]">
                <FileStack className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold">Caries Classifier</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                caries_model1.h5 — a custom-trained model that takes the validated X-ray at its expected input
                resolution and returns a caries confidence score.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#22d3ee]">Threshold Logic</div>
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">Confidence, not a black-box yes/no</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your clinic sets a sensitivity threshold (default 85%). If the caries score clears it, the result reads
            "Caries Found" with a restorative-treatment recommendation; below threshold, it reads "No Caries
            Detected" with a routine check-up recommendation — the confidence percentage shown is always relative to
            that call.
          </p>
        </Reveal>
      </section>

      <section className="bg-muted/40 px-6 py-24">
        <Reveal
          className="mx-auto max-w-3xl rounded-3xl border border-border p-14 text-center bg-[linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.1))]"
        >
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">Try the pipeline on a real image</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Upload an X-ray in the live demo and watch each stage run in real time.
          </p>
          <Button size="lg" asChild className="mt-7 shadow-[0_10px_30px_rgba(99,102,241,0.35)]">
            <a href="/dashboard-demo">Launch Live Demo</a>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
