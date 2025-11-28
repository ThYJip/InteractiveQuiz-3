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
          const duration = 4 + Math.random() * 3;
          const size = 15 + Math.random() * 20;
          const color = ['#A7F3D0', '#5EEAD4', '#99F6E4', '#CCFBF1'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute opacity-60 shadow-sm"
                style={{
                    backgroundColor: color,
                    width: size,
                    height: size,
                    borderRadius: '0 50% 50% 50%', // Leaf-ish shape
                    left: `${left}%`,
                    top: '-10%',
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `swirl ${duration}s ease-in-out ${delay}s infinite`
                }}
            />
          )
      })}
      <style>{`
        @keyframes swirl {
            0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0.8; }
            25% { transform: translateY(30vh) rotate(90deg) translateX(50px); }
            50% { transform: translateY(60vh) rotate(180deg) translateX(-50px); }
            75% { transform: translateY(80vh) rotate(270deg) translateX(20px); }
            100% { transform: translateY(110vh) rotate(360deg) translateX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;