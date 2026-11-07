interface FireflyProps {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  id: string;
}

/**
 * A lightweight CSS-only firefly.
 *
 * The glow and the bright core share the same wrapper, and the core is
 * centered with flexbox instead of absolute offsets. The flutter animation
 * only moves it a couple of pixels, so the white point always stays inside
 * the halo.
 */
const Firefly = ({ x, y }: FireflyProps) => (
  <div
    className="absolute w-5 h-5 -ml-2.5 -mt-2.5 pointer-events-none z-0"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      transition: 'left 2s ease-in-out, top 2s ease-in-out',
      willChange: 'left, top',
    }}
  >
    {/* Soft outer halo */}
    <div
      className="absolute inset-0 rounded-full opacity-80 animate-pulse"
      style={{
        background:
          'radial-gradient(circle, rgba(34, 211, 238, 0.75) 0%, rgba(8, 145, 178, 0.35) 45%, transparent 72%)',
        boxShadow: '0 0 12px #22d3ee, 0 0 24px #22d3ee55',
      }}
    />

    {/* Bright core, always centered inside the halo */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_12px_#22d3ee] animate-[firefly-flutter_2.4s_ease-in-out_infinite]" />
    </div>
  </div>
);

export default Firefly;
