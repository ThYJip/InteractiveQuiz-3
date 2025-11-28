
import React, { useEffect, useState } from 'react';

const VictoryScreen: React.FC = () => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 50 }, (_, i) => i);
    setPieces(p);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = 2 + Math.random() * 2;
          const size = 5 + Math.random() * 15;
          const bg = ['#E879F9', '#F0ABFC', '#F5D0FE', '#C026D3'][Math.floor(Math.random() * 4)];
          const char = ['✨', '🎈', '🍬', '👻'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute flex items-center justify-center text-xl opacity-80"
                style={{
                    color: bg,
                    left: `${left}%`,
                    top: '-10%',
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `fall ${duration}s ease-in-out ${delay}s infinite`
                }}
            >
                {char}
            </div>
          )
      })}
      <style>{`
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
