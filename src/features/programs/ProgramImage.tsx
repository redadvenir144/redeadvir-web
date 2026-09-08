// TODO: solicitar imágenes reais ao cliente

interface ProgramImageProps {
  /** Título del programa para generar iniciales */
  title: string;
  /** Tamaño de la imagen */
  size?: 'sm' | 'md' | 'lg';
  /** Clases adicionales */
  className?: string;
}

const sizeClasses = {
  sm: 'h-24 w-full text-2xl',
  md: 'h-40 w-full text-4xl',
  lg: 'h-56 w-full text-5xl',
};

/**
 * Genera las iniciales de un título (máx 2 letras).
 */
function getInitials(title: string): string {
  const words = title.split(' ').filter((w) => w.length > 0);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/**
 * Imagen placeholder para programas.
 * Muestra las iniciales del programa sobre el color de marca.
 * Se reemplazará por imágenes reales cuando estén disponibles.
 */
export function ProgramImage({
  title,
  size = 'md',
  className = '',
}: ProgramImageProps) {
  const initials = getInitials(title);

  return (
    <div
      className={[
        'flex items-center justify-center',
        'bg-gradient-to-br from-brand-500 to-brand-700',
        'rounded-lg',
        'select-none',
        sizeClasses[size],
        className,
      ].join(' ')}
      role="img"
      aria-label={`Imagem do programa ${title}`}
    >
      <span className="font-bold text-white/90 tracking-wider">
        {initials}
      </span>
    </div>
  );
}
