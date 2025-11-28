
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
          const duration = 2 + Math.random() * 3;
          const size = 5 + Math.random() * 10;
          const bg = ['#818CF8', '#C7D2FE', '#FCD34D', '#FFFFFF'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute shadow-sm"
                style={{
                    backgroundColor: bg,
                    width: i % 2 === 0 ? size : 2,
                    height: i % 2 === 0 ? size : size * 5, // Rain vs Sparkles
                    borderRadius: i % 2 === 0 ? '50%' : 0,
                    left: `${left}%`,
                    top: '-10%',
                    opacity: 0.6,
                    transform: `rotate(${Math.random() * 20}deg)`,
                    animation: `fall ${duration}s linear ${delay}s infinite`
                }}
            />
          )
      })}
      <style>{`
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
