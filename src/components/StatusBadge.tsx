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
  [GameStatus.RELEASED]: "bg-green-600",
  [GameStatus.IN_DEVELOPMENT]: "bg-yellow-500",
  [GameStatus.ON_HOLD]: "bg-gray-500",
  [GameStatus.CANCELED]: "bg-red-600",
  [GameStatus.RELEASED_DEMO]: 'bg-green-400',
  [GameStatus.PROTOTYPE]: 'bg-gray-200',
  [GameStatus.LOST_MEDIA]: 'bg-red-200',
  [GameStatus.EARLY_ACCESS]: 'bg-cyan-500',
  [GameStatus.RECOVERED]: 'bg-blue-500',
  [GameStatus.UNKNOWN]: 'bg-gray-900'
};

const defaultTextMap: Record<GameStatus, string> = {
  [GameStatus.RELEASED]: "text-green-500",
  [GameStatus.IN_DEVELOPMENT]: "text-yellow-500",
  [GameStatus.ON_HOLD]: "text-gray-500",
  [GameStatus.CANCELED]: "text-red-600",
  [GameStatus.RELEASED_DEMO]: 'text-green-700',
  [GameStatus.PROTOTYPE]: 'text-gray-700',
  [GameStatus.LOST_MEDIA]: 'text-red-700',
  [GameStatus.EARLY_ACCESS]: 'text-cyan-500',
  [GameStatus.RECOVERED]: 'text-blue-500',
  [GameStatus.UNKNOWN]: 'text-gray-900'
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