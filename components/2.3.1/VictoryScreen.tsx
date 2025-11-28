import React, { useEffect, useState } from 'react';

const VictoryScreen: React.FC = () => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 40 }, (_, i) => i);
    setPieces(p);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map((i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = 3 + Math.random() * 2;
          const size = 10 + Math.random() * 10;
          const color = ['#5D4037', '#795548', '#388E3C', '#81C784'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute rounded-full opacity-80 shadow-sm"
                style={{
                    backgroundColor: color,
                    width: size,
                    height: size,
                    borderRadius: i % 2 === 0 ? '50%' : '10% 50% 10% 50%', // Leaf shape simulation
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
            50% { transform: translateY(50vh) rotate(180deg) translateX(50px); opacity: 0.9; }
            100% { transform: translateY(110vh) rotate(360deg) translateX(-50px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;