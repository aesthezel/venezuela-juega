interface FireflyProps {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  id: string;
}

/**
 * A lightweight CSS-only firefly.
 *
 * The halo and the white core live inside the same `.vj-firefly-body`, so
 * they always move together. The body wanders in a small organic loop while
 * the outer wrapper transitions between the server-provided x/y positions.
 * Both lights share the same breathing animation, which keeps the bright
 * center visually attached to its glow.
 */
const Firefly = ({ x, y, id }: FireflyProps) => {
  // Stable per-firefly offset so multiple fireflies don't wander in lockstep.
  const seed = id.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  const wanderDelay = -(seed % 7000);

  return (
    <div
      className="absolute w-6 h-6 -ml-3 -mt-3 pointer-events-none z-0"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transition: 'left 2s ease-in-out, top 2s ease-in-out',
        willChange: 'left, top',
      }}
    >
      <div
        className="vj-firefly-body absolute inset-0"
        style={{ animationDelay: `${wanderDelay}ms` }}
      >
        {/* Soft outer halo */}
        <div className="vj-firefly-halo absolute inset-0 rounded-full" />

        {/* Bright core, centered inside the halo and travelling with it */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="vj-firefly-core w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
};

export default Firefly;
