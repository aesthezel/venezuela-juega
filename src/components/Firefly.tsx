import { useLayoutEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';

interface FireflyProps {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  id: string;
}

const Firefly = ({ x, y, id }: FireflyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  // Set initial position immediately on first render via GSAP to avoid teleportation
  useLayoutEffect(() => {
    if (!elementRef.current) return;
    
    // Position immediately without transition on first mount
    gsap.set(elementRef.current, {
      left: `${x}%`,
      top: `${y}%`
    });
  }, []); // Only once on mount

  // Smooth movement transition (Lerp)
  useLayoutEffect(() => {
    if (!elementRef.current) return;

    // Movement animation - matching the 2s heartbeat for continuous flow
    gsap.to(elementRef.current, {
      left: `${x}%`,
      top: `${y}%`,
      duration: 2,
      ease: 'power1.inOut',
      overwrite: 'auto'
    });
  }, [x, y]);

  // Idle Flutter (Revoloteo) & Flickering
  useLayoutEffect(() => {
    if (!elementRef.current) return;

    // Separate animation for the "alive" feeling (floating)
    const float = gsap.to(elementRef.current, {
      x: 'random(-15, 15)',
      y: 'random(-15, 15)',
      duration: 'random(1.5, 3)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Flickering core
    const flicker = gsap.to(elementRef.current, {
      opacity: 'random(0.4, 1)',
      scale: 'random(0.8, 1.2)',
      duration: 'random(0.1, 0.5)',
      repeat: -1,
      yoyo: true,
      ease: 'none'
    });

    return () => {
      float.kill();
      flicker.kill();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className="fixed w-3 h-3 -ml-1.5 -mt-1.5 rounded-full pointer-events-none z-[9999]"
      style={{
        background: 'radial-gradient(circle, #22d3ee 0%, #0891b2 50%, transparent 100%)',
        boxShadow: '0 0 15px #22d3ee, 0 0 30px #22d3ee66',
      }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 w-full h-full animate-pulse opacity-30 bg-cyan-400 rounded-full blur-[2px]" />
      
      {/* Core point */}
      <div className="absolute inset-1 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
    </div>
  );
};

export default Firefly;
