import { ComponentChildren, VNode } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { ArrowLeftIcon } from '@/src/components/icons';

// TODO: move to global types
type Size = 'sm' | 'md' | 'lg';

interface BackButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'className'> {
  onClick: () => void;
  children?: ComponentChildren;
  className?: string;
  icon?: VNode;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
};

const BackButton = ({ onClick, children = 'Volver a la lista', className = '', icon, size = 'md', ...rest }: BackButtonProps) => {
  const base =
    'inline-flex items-center gap-2 bg-slate-800 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors duration-300';
  return (
    <button onClick={onClick} className={`${base} ${sizeClasses[size]} ${className}`} {...rest}>
      {icon ?? <ArrowLeftIcon />}
      <span>{children}</span>
    </button>
  );
};

export default BackButton;