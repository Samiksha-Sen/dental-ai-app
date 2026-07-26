import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/ai-technology', label: 'AI Technology' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2.5 font-heading text-sm font-extrabold">
          <Logo size={26} />
          <span>DENTAL.AI</span>
        </div>
        <div className="flex flex-wrap gap-5">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </NavLink>
          ))}
          <a href="/dashboard-demo" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard Demo
          </a>
        </div>
        <p className="w-full text-xs text-muted-foreground">
          © 2026 DentalAI Clinical Diagnostics. For clinical decision support — not a replacement for professional diagnosis.
        </p>
      </div>
    </footer>
  );
}
