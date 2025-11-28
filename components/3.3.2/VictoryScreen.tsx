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
          const size = 5 + Math.random() * 15;
          const bg = ['#EF4444', '#F97316', '#FCA5A5', '#FDBA74'][Math.floor(Math.random() * 4)];
          
          return (
            <div 
                key={i}
                className="absolute shadow-sm"
                style={{
                    backgroundColor: bg,
                    width: size,
                    height: size, 
                    borderRadius: '50% 50% 50% 0', // Flame shape
                    left: `${left}%`,
                    bottom: '-10%',
                    transform: `rotate(-45deg)`,
                    animation: `rise ${duration}s ease-out ${delay}s infinite`
                }}
            />
          )
      })}
      <style>{`
        @keyframes rise {
            0% { transform: translateY(0) rotate(-45deg) scale(1); opacity: 1; }
            100% { transform: translateY(-110vh) rotate(45deg) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;