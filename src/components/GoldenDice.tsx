import { useState, useEffect } from 'react';

interface Props {
  onCollect: (type: 'buff' | 'lump') => void;
}

export default function GoldenDice({ onCollect }: Props) {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    // Define posição aleatória ao aparecer
    setPosition({
      top: `${Math.random() * 70 + 15}%`,
      left: `${Math.random() * 80 + 10}%`
    });

    // Some sozinho após 8 segundos
    const timer = setTimeout(() => {
      onCollect('lump'); // Se não clicar, não ganha nada (ou pode colocar um auto-coletar falho)
      // Na verdade, vamos forçar o unmount pelo App. O App controla o timer.
    }, 8000);

    return () => clearTimeout(timer);
  }, [onCollect]);

  return (
    <div 
      onClick={() => onCollect('buff')}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: '60px', height: '60px',
        background: 'radial-gradient(circle, #ffd700, #ff8c00)',
        borderRadius: '15px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontSize: '2rem', cursor: 'pointer',
        boxShadow: '0 0 30px #ffd700',
        animation: 'bounce 0.3s infinite alternate',
        zIndex: 1000,
        transform: 'rotate(15deg)'
      }}
    >
      🎲
    </div>
  );
}