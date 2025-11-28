
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
          const duration = 2 + Math.random() * 2;
          const size = 10 + Math.random() * 15;
          const bg = ['#22D3EE', '#67E8F9', '#A5F3FC', '#06B6D4'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute shadow-sm"
                style={{
                    backgroundColor: bg,
                    width: size,
                    height: size * 0.8, 
                    borderRadius: 2,
                    border: '2px solid rgba(255,255,255,0.5)', // Photo frame look
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
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
