
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
          const duration = 2 + Math.random() * 3;
          const size = 15 + Math.random() * 10;
          // Snack colors
          const bg = ['#FCA5A5', '#FCD34D', '#93C5FD', '#A7F3D0'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute shadow-sm border border-black/10"
                style={{
                    backgroundColor: bg,
                    width: size,
                    height: size * 1.5, // Box shape
                    borderRadius: 4,
                    left: `${left}%`,
                    top: '-10%',
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `fall ${duration}s ease-in-out ${delay}s infinite`
                }}
            />
          )
      })}
      <style>{`
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
