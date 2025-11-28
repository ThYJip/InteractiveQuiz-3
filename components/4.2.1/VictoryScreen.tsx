
import React, { useEffect, useState } from 'react';

const VictoryScreen: React.FC = () => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 60 }, (_, i) => i);
    setPieces(p);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = 1 + Math.random() * 2; // Faster, tech feel
          const size = 2 + Math.random() * 4;
          const color = ['#22D3EE', '#0EA5E9', '#F0F9FF', '#67E8F9'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute shadow-[0_0_10px_currentColor]"
                style={{
                    backgroundColor: color,
                    width: size,
                    height: size, 
                    borderRadius: 0, // Square pixels
                    left: `${left}%`,
                    top: '-10%',
                    opacity: 0.8,
                    animation: `fall ${duration}s linear ${delay}s infinite`
                }}
            />
          )
      })}
      <style>{`
        @keyframes fall {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(110vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
