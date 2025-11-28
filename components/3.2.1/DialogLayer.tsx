
import React, { useState, useEffect } from 'react';
import { Speaker } from './types';
import { Tent, User, ArrowRight, Ghost, Glasses, Home, Cat } from 'lucide-react';

interface Props {
  speaker: Speaker;
  text: string;
  onNext: () => void;
  canProceed: boolean;
  isLastStep?: boolean;
  onHome?: () => void;
}

const DialogLayer: React.FC<Props> = ({ speaker, text, onNext, canProceed, isLastStep, onHome }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const speed = 30; // ms per char

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  const getSpeakerConfig = () => {
    switch (speaker) {
      case 'Nadeshiko':
        return { 
            name: '抚子', 
            bg: 'bg-pink-100', 
            border: 'border-pink-400', 
            text: 'text-pink-600',
            icon: <Ghost size={20} className="text-pink-500" />
        };
      case 'Rin':
        return { 
            name: '志摩 凛', 
            bg: 'bg-blue-100', 
            border: 'border-blue-400', 
            text: 'text-blue-600',
            icon: <User size={20} className="text-blue-500" />
        };
      case 'Sensei':
        return { 
            name: '前辈', 
            bg: 'bg-green-100', 
            border: 'border-green-400', 
            text: 'text-green-600',
            icon: <Glasses size={20} className="text-green-500" />
        };
      case 'Chi':
        return { 
            name: '小奇', 
            bg: 'bg-purple-100', 
            border: 'border-purple-400', 
            text: 'text-purple-600', 
            icon: <Cat size={20} className="text-purple-500" /> 
        };
      default:
        return { name: 'System', bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-600', icon: <Tent size={20} /> };
    }
  };

  const config = getSpeakerConfig();

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="relative w-full max-w-4xl bg-white rounded-[2rem] p-8 pb-10 shadow-[0_20px_50px_-12px_rgba(192,132,252,0.4)] border border-purple-100 pointer-events-auto">
        
        {/* Nameplate */}
        <div className={`absolute -top-5 left-10 ${config.bg} border-2 ${config.border} px-6 py-2 rounded-full shadow-sm z-10 flex items-center gap-2 transform -rotate-1`}>
          {config.icon}
          <span className={`font-bold ${config.text} tracking-wider`}>{config.name}</span>
        </div>

        {/* Corner Brackets (Purple Style) */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-purple-300 rounded-tl-xl opacity-60" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-purple-300 rounded-tr-xl opacity-60" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-purple-300 rounded-bl-xl opacity-60" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-purple-300 rounded-br-xl opacity-60" />

        {/* Content */}
        <div className="mt-2 pr-24">
            <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-bold tracking-wide">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-5 bg-purple-400 ml-1 animate-pulse align-middle rounded-full"></span>}
            </p>
        </div>

        {/* Action Buttons */}
        {!isTyping && (
            <>
                {/* Next Button */}
                {!isLastStep && canProceed && (
                    <button 
                        onClick={onNext}
                        className="absolute bottom-6 right-8 text-purple-500 animate-bounce flex items-center gap-1 hover:text-purple-700 transition-colors"
                    >
                    <span className="text-sm font-bold uppercase tracking-widest">Next</span>
                    <ArrowRight size={20} />
                    </button>
                )}

                {/* Return Home Button (Only on Last Step) */}
                {isLastStep && onHome && (
                     <button 
                        onClick={onHome}
                        className="absolute bottom-6 right-8 bg-purple-100 hover:bg-purple-200 text-purple-700 px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all animate-pulse"
                    >
                        <Home size={18} />
                        <span>返回大厅</span>
                    </button>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default DialogLayer;
