import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useNavScrolled } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/ai-technology', label: 'AI Technology' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'text-sm font-semibold transition-colors',
          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function Nav() {
  const scrolled = useNavScrolled();

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300',
        scrolled ? 'bg-background/85 border-b border-border' : 'bg-background/50 border-b border-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
        <NavLink to="/" className="flex items-center gap-2.5 font-heading text-base font-extrabold tracking-wide">
          <Logo />
          <span>DENTAL.AI</span>
        </NavLink>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden shadow-[0_8px_20px_rgba(99,102,241,0.35)] md:inline-flex">
            <a href="/dashboard-demo">Launch Portal</a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-heading">
                  <Logo size={26} />
                  DENTAL.AI
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {LINKS.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <NavItem {...l} />
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a href="/dashboard-demo" className="mt-3">
                    <Button className="w-full">Launch Portal</Button>
                  </a>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
