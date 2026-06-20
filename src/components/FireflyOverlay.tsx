import { useFireflyOverlay } from '../hooks/FireflyContext';
import Firefly from './Firefly';

/** Cap fireflies para evitar costo paint exponencial (box-shadow + radial-gradient + GSAP perpetuo por instancia). */
const MAX_FIREFLIES = 10;

const FireflyOverlay = () => {
  const { otherFireflies } = useFireflyOverlay();
  const visible = otherFireflies.length > MAX_FIREFLIES
    ? otherFireflies.slice(0, MAX_FIREFLIES)
    : otherFireflies;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden select-none">
      {visible.map((f) => (
        <Firefly
          key={f.playerId.toHexString()}
          id={f.playerId.toHexString()}
          x={f.x}
          y={f.y}
        />
      ))}
    </div>
  );
};

export default FireflyOverlay;
