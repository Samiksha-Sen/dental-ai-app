import { useEffect, useState } from 'react';

// Same rAF count-up technique used by the mobile app's AnimatedCounter and
// the old static/animations.js — only starts once `start` is true.
export function useCountUp(target, { start = false, duration = 1200, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    const beginTime = performance.now();
    const tick = (now) => {
      const t = Math.min((now - beginTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString();
}
