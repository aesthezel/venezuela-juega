import { useFireflyOverlay } from '../hooks/FireflyContext';
import Firefly from './Firefly';

const FireflyOverlay = () => {
  const { otherFireflies } = useFireflyOverlay();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[9999] overflow-hidden select-none">
      {otherFireflies.map((f) => (
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
