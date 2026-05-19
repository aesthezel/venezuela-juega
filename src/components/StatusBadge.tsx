import { GameStatus } from '@/types';
import { JSX } from 'preact/jsx-runtime';

type Variant = 'solid' | 'soft' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

export interface StatusBadgeProps {
  status: GameStatus;
  className?: string;
  variant?: Variant;
  size?: Size;
  colorMap?: Partial<Record<GameStatus, string>>;
}

// DaisyUI badge with arbitrary tailwind colors to preserve exact status identity
const defaultBgMap: Record<GameStatus, string> = {
  [GameStatus.RELEASED]: "bg-[#16a34a]",
  [GameStatus.IN_DEVELOPMENT]: "bg-[#f2b63d]",
  [GameStatus.ON_HOLD]: "bg-[#71717a]",
  [GameStatus.CANCELED]: "bg-[#94353d]",
  [GameStatus.RELEASED_DEMO]: "bg-[#4ade80]",
  [GameStatus.PROTOTYPE]: "bg-[#e4e4e7]",
  [GameStatus.LOST_MEDIA]: "bg-[#fecaca]",
  [GameStatus.EARLY_ACCESS]: "bg-[#449489]",
  [GameStatus.RECOVERED]: "bg-[#457cd6]",
  [GameStatus.UNKNOWN]: "bg-[#18181b]"
};

const defaultTextMap: Record<GameStatus, string> = {
  [GameStatus.RELEASED]: "text-[#16a34a]",
  [GameStatus.IN_DEVELOPMENT]: "text-[#f2b63d]",
  [GameStatus.ON_HOLD]: "text-[#71717a]",
  [GameStatus.CANCELED]: "text-[#94353d]",
  [GameStatus.RELEASED_DEMO]: "text-[#4ade80]",
  [GameStatus.PROTOTYPE]: "text-[#e4e4e7]",
  [GameStatus.LOST_MEDIA]: "text-[#fecaca]",
  [GameStatus.EARLY_ACCESS]: "text-[#449489]",
  [GameStatus.RECOVERED]: "text-[#457cd6]",
  [GameStatus.UNKNOWN]: "text-[#18181b]"
};

// DaisyUI badge sizes - Añadimos height auto y padding para que no se vean comprimidos
const sizeClasses: Record<Size, string> = {
  xs: 'badge-xs px-2 py-1 h-auto text-[10px]',
  sm: 'badge-sm px-2.5 py-1.5 h-auto text-xs',
  md: 'badge-md px-3.5 py-2 h-auto text-sm',
  lg: 'badge-lg px-4 py-2.5 h-auto text-base',
};

function toSoftBg(bgClass: string) {
  // Convierte "bg-color-500" en "bg-color-500/20" para un estilo "soft"
  if (bgClass.includes('/')) return bgClass;
  return `${bgClass}/20`;
}

export default function StatusBadge({
  status,
  className = '',
  variant = 'solid',
  size = 'md', // Cambio del default de sm a md
  colorMap,
}: StatusBadgeProps): JSX.Element {
  const bgMap = { ...defaultBgMap, ...(colorMap || {}) };
  const bg = bgMap[status] || 'bg-neutral';
  const text = defaultTextMap[status] || 'text-white';

  // DaisyUI variant mapping
  let variantClasses = '';
  switch (variant) {
    case 'solid':
      variantClasses = `${bg} text-base-100 border-transparent shadow-sm`;
      break;
    case 'soft':
      variantClasses = `badge-soft ${toSoftBg(bg)} ${text} border-transparent`;
      break;
    case 'outline':
      variantClasses = `badge-outline ${text} border-current`;
      break;
  }

  return (
    <span
      className={`badge ${sizeClasses[size]} ${variantClasses} font-bold uppercase tracking-wider ${className}`}
    >
      {status}
    </span>
  );
}