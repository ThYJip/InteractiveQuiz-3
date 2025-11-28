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
          const size = 8 + Math.random() * 8;
          // Warmer colors for the cozy theme
          const bg = ['#FDBA74', '#FDA4AF', '#86EFAC', '#FCD34D'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute rounded-full opacity-80 shadow-sm"
                style={{
                    backgroundColor: bg,
                    width: size,
                    height: size,
                    left: `${left}%`,
                    top: '-10%',
                    animation: `fall ${duration}s ease-in-out ${delay}s infinite`
                }}
            />
          )
      })}
      <style>{`
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
            50% { transform: translateY(60vh) rotate(180deg) translateX(20px); opacity: 0.8; }
            100% { transform: translateY(110vh) rotate(360deg) translateX(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;