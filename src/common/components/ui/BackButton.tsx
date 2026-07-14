import { ComponentChildren, VNode } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { ArrowLeftIcon } from '@/components/icons';

// TODO: move to global types
type Size = 'sm' | 'md' | 'lg';

interface BackButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'className' | 'size' | 'icon'> {
  onClick: () => void;
  children?: ComponentChildren;
  className?: string;
  icon?: VNode;
  size?: Size;
}

// DaisyUI button sizes
const sizeClasses: Record<Size, string> = {
  sm: 'btn-sm',
  md: '',      // default DaisyUI size
  lg: 'btn-lg',
};

const BackButton = ({ onClick, children = 'Volver a la lista', className = '', icon, size = 'md', ...rest }: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-neutral gap-2 ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon ?? <ArrowLeftIcon />}
      <span>{children}</span>
    </button>
  );
};

export default BackButton;