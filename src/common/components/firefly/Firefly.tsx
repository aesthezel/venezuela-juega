interface FireflyProps {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  id: string;
}

/**
 * A lightweight CSS-only firefly.
 *
 * The white core and the cyan halo are part of the same radial-gradient on a
 * single element. There is no separate inner dot that can drift out of the
 * light: the whole firefly wanders and breathes as one piece.
 */
const Firefly = ({ x, y, id }: FireflyProps) => {
  // Stable per-firefly offset so multiple fireflies don't wander in lockstep.
  const seed = id.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  const wanderDelay = -(seed % 7000);

  return (
    <div
      className="vj-firefly-wrapper absolute w-6 h-6 -ml-3 -mt-3 pointer-events-none z-0"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transition: 'left 2s ease-in-out, top 2s ease-in-out',
        animationDelay: `${wanderDelay}ms`,
        willChange: 'left, top, transform',
      }}
    >
      <div className="vj-firefly-glow absolute inset-0 rounded-full" />
    </div>
  );
};

export default Firefly;
