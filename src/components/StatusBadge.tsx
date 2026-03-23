import { GameStatus } from '@/src/types';
import { JSX } from 'preact/jsx-runtime';

type Variant = 'solid' | 'soft' | 'outline';
type Size = 'xs' | 'sm' | 'md';

export interface StatusBadgeProps {
  status: GameStatus;
  className?: string;
  variant?: Variant;
  size?: Size;
  colorMap?: Partial<Record<GameStatus, string>>;
}

const defaultBgMap: Record<GameStatus, string> = {
  [GameStatus.RELEASED]: "bg-status-released",
  [GameStatus.IN_DEVELOPMENT]: "bg-status-in-development",
  [GameStatus.ON_HOLD]: "bg-status-on-hold",
  [GameStatus.CANCELED]: "bg-status-canceled",
  [GameStatus.RELEASED_DEMO]: "bg-status-demo",
  [GameStatus.PROTOTYPE]: "bg-status-prototype",
  [GameStatus.LOST_MEDIA]: "bg-status-lost",
  [GameStatus.EARLY_ACCESS]: "bg-status-early",
  [GameStatus.RECOVERED]: "bg-status-recovered",
  [GameStatus.UNKNOWN]: "bg-status-unknown"
};

const defaultTextMap: Record<GameStatus, string> = {
  [GameStatus.RELEASED]: "text-status-released",
  [GameStatus.IN_DEVELOPMENT]: "text-status-in-development",
  [GameStatus.ON_HOLD]: "text-status-on-hold",
  [GameStatus.CANCELED]: "text-status-canceled",
  [GameStatus.RELEASED_DEMO]: "text-status-demo",
  [GameStatus.PROTOTYPE]: "text-status-prototype",
  [GameStatus.LOST_MEDIA]: "text-status-lost",
  [GameStatus.EARLY_ACCESS]: "text-status-early",
  [GameStatus.RECOVERED]: "text-status-recovered",
  [GameStatus.UNKNOWN]: "text-status-unknown"
};

const sizeClasses: Record<Size, string> = {
  xs: 'text-[10px] px-1.5 py-0.5 rounded',
  sm: 'text-xs px-2 py-0.5 rounded',
  md: 'text-sm px-2.5 py-1 rounded-md',
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
  size = 'sm',
  colorMap,
}: StatusBadgeProps): JSX.Element {
  const bgMap = { ...defaultBgMap, ...(colorMap || {}) };
  const bg = bgMap[status] || 'bg-gray-500';
  const text = defaultTextMap[status] || 'text-white';

  let variantClasses = '';
  switch (variant) {
    case 'solid':
      variantClasses = `${bg} text-black`;
      break;
    case 'soft':
      variantClasses = `${toSoftBg(bg)} ${text} ring-1 ring-white/15`;
      break;
    case 'outline':
      variantClasses = `bg-transparent ${text} ring-1 ring-current`;
      break;
  }

  return (
    <span
      className={`inline-block font-semibold ${sizeClasses[size]} ${variantClasses} ${className}`}
    >
      {status}
    </span>
  );
}