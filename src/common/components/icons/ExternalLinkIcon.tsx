// src/components/ExternalLinkIcon.tsx
import { h } from 'preact';

interface ExternalLinkIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ExternalLinkIcon = ({ className = '', size = 'md' }: ExternalLinkIconProps) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
      />
    </svg>
  );
};

export default ExternalLinkIcon;