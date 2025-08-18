import { JSX } from 'preact/jsx-runtime';

interface CoverImageProps {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

const CoverImage = ({ src, alt, className = '', imgClassName = '' }: CoverImageProps): JSX.Element => {
  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={alt}
        className={imgClassName || className}
        loading="lazy"
      />
    );
  }

  // Placeholder con degradado + emoji
  return (
    <div
      className={className}
      aria-label={alt}
      role="img"
      style={{
        background: 'linear-gradient(135deg, rgba(8,145,178,0.25), rgba(2,6,23,0.6))', // cyan -> slate
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '3rem', lineHeight: 1 }} role="presentation">🎮</span>
    </div>
  );
};

export default CoverImage;