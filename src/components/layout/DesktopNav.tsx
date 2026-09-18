import { NAV_ITEMS } from '@/lib/config/site';
import { NavLink } from './NavLink';

interface DesktopNavProps {
  /** Si el canal está emitiendo */
  isChannelLive?: boolean;
}

export function DesktopNav({ isChannelLive = false }: DesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          isLive={item.isLive}
          isChannelLive={isChannelLive}
        />
      ))}
    </nav>
  );
}
