interface FireflyProps {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  id: string;
}

/**
 * A lightweight CSS-only firefly.
 *
 * Previously each firefly created two infinite GSAP timelines. With several
 * visitors online that meant dozens of JS-driven animations competing with
 * hydration and scrolling on mobile. CSS transforms are composited on the GPU
 * and cost effectively nothing on the main thread.
 */
const Firefly = ({ x, y }: FireflyProps) => (
  <div
    className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full pointer-events-none z-0"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      transition: 'left 2s ease-in-out, top 2s ease-in-out',
      background: 'radial-gradient(circle, #22d3ee 0%, #0891b2 50%, transparent 100%)',
      boxShadow: '0 0 15px #22d3ee, 0 0 30px #22d3ee66',
      willChange: 'left, top',
    }}
  >
    {/* Outer glow ring */}
    <div className="absolute -inset-1 rounded-full opacity-30 bg-accent-teal blur-[2px] animate-pulse" />

    {/* Fluttering core */}
    <div className="absolute inset-1 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-[firefly-flutter_2.4s_ease-in-out_infinite]" />
  </div>
);

export default Firefly;
