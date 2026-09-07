import { HeaderClient } from './HeaderClient';

interface HeaderProps {
  /** Si el canal está emitiendo */
  isChannelLive?: boolean;
}

/**
 * Header del sitio.
 * Server Component que delega la lógica de estado al Client Component.
 */
export function Header({ isChannelLive = false }: HeaderProps) {
  return <HeaderClient isChannelLive={isChannelLive} />;
}
