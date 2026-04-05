import { useFireflies } from '../hooks/useFireflies';
import Firefly from './Firefly';

interface FireflyOverlayProps {
  currentPath: string;
}

const FireflyOverlay = ({ currentPath }: FireflyOverlayProps) => {
  const { otherFireflies } = useFireflies(currentPath);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
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
