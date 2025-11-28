import React, { useEffect, useState } from 'react';

const VictoryScreen: React.FC = () => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    // Generate random confetti pieces
    const p = Array.from({ length: 50 }, (_, i) => i);
    setPieces(p);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = 2 + Math.random() * 3;
          const bg = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute w-3 h-3 rounded-sm opacity-80"
                style={{
                    backgroundColor: bg,
                    left: `${left}%`,
                    top: '-10%',
                    animation: `fall ${duration}s linear ${delay}s infinite`
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