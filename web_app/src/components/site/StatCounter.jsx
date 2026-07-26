import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';

export default function StatCounter({ value, suffix = '', decimals = 0, label }) {
  const { ref, visible } = useScrollReveal({ threshold: 0.4 });
  const display = useCountUp(value, { start: visible, decimals });

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-white/5 p-5 text-center">
      <div className="font-heading text-3xl font-extrabold bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] bg-clip-text text-transparent">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
