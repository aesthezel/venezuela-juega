import { JSX } from 'preact/jsx-runtime';
import { useState } from 'preact/hooks';

interface CoverImageProps {
  src?: string;
  alt: string;
  className?: string; // Class for the non-image placeholder or container if needed
  imgClassName?: string; // Class for the image element itself
}

const CoverImage = ({ src, alt, className = '', imgClassName = '' }: CoverImageProps): JSX.Element => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (src && src.trim() !== '' && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={imgClassName || className}
        loading="lazy"
        onError={handleError}
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
        background: 'linear-gradient(135deg, rgba(8,145,178,0.25), rgba(2,6,23,0.6))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        userSelect: 'none',
        minHeight: '250px', // Fallback height when no image or error
      }}
    >
      <span style={{ fontSize: '2rem', lineHeight: 1, paddingBottom: 15 }} role="presentation">🎮</span>
    </div>
  );
};

export default CoverImage;