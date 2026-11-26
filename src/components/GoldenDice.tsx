import { useState, useEffect } from 'react';

interface Props {
  onCollect: (type: 'buff' | 'lump') => void;
}

export default function GoldenDice({ onCollect }: Props) {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    setPosition({
      top: `${Math.random() * 70 + 15}%`,
      left: `${Math.random() * 80 + 10}%`
    });
  }, []);

  return (
    <div 
      onClick={() => onCollect('buff')}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: '80px', height: '80px',
        background: 'radial-gradient(circle, #ffd700, #ff8c00)',
        borderRadius: '50%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 0 40px #ffd700',
        animation: 'bounce 0.3s infinite alternate',
        zIndex: 1000,
      }}
    >
      <img src="/icons/golden-d20.svg" alt="Golden D20" style={{ width: '60px', height: '60px', filter: 'invert(1)' }} />
    </div>
  );
}