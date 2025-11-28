
import React, { useState, useEffect } from 'react';
import { Speaker } from './types';
import { Tent, User, ArrowRight, Ghost, Glasses, Home, Cat, Bot } from 'lucide-react';

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
            bg: 'bg-pink-900/80', 
            border: 'border-pink-500', 
            text: 'text-pink-300',
            icon: <Ghost size={20} className="text-pink-400" />
        };
      case 'Rin':
        return { 
            name: '志摩 凛', 
            bg: 'bg-blue-900/80', 
            border: 'border-blue-500', 
            text: 'text-blue-300',
            icon: <User size={20} className="text-blue-400" />
        };
      case 'Sensei':
        return { 
            name: '前辈', 
            bg: 'bg-green-900/80', 
            border: 'border-green-500', 
            text: 'text-green-300',
            icon: <Glasses size={20} className="text-green-400" />
        };
      case 'Chi':
        return { 
            name: '舰长小奇', 
            bg: 'bg-cyan-900/80', 
            border: 'border-cyan-500', 
            text: 'text-cyan-300', 
            icon: <Cat size={20} className="text-cyan-400" /> 
        };
      default:
        return { name: 'System', bg: 'bg-slate-800', border: 'border-slate-600', text: 'text-slate-400', icon: <Bot size={20} /> };
    }
  };

  const config = getSpeakerConfig();

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="relative w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-8 pb-10 shadow-[0_0_50px_rgba(6,182,212,0.2)] border border-cyan-500/30 pointer-events-auto">
        
        {/* Nameplate */}
        <div className={`absolute -top-5 left-10 ${config.bg} border-2 ${config.border} px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 flex items-center gap-2 transform -rotate-1`}>
          {config.icon}
          <span className={`font-bold ${config.text} tracking-wider`}>{config.name}</span>
        </div>

        {/* Corner Brackets (Cyber Style) */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-none opacity-80" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-none opacity-80" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-none opacity-80" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-none opacity-80" />

        {/* Content */}
        <div className="mt-2 pr-24">
            <p className="text-cyan-50 text-lg md:text-xl leading-relaxed font-medium tracking-wide drop-shadow-md">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse align-middle"></span>}
            </p>
        </div>

        {/* Action Buttons */}
        {!isTyping && (
            <>
                {/* Next Button */}
                {!isLastStep && canProceed && (
                    <button 
                        onClick={onNext}
                        className="absolute bottom-6 right-8 text-cyan-400 animate-pulse flex items-center gap-1 hover:text-cyan-200 transition-colors"
                    >
                    <span className="text-sm font-bold uppercase tracking-widest font-mono">NEXT_STEP</span>
                    <ArrowRight size={20} />
                    </button>
                )}

                {/* Return Home Button (Only on Last Step) */}
                {isLastStep && onHome && (
                     <button 
                        onClick={onHome}
                        className="absolute bottom-6 right-8 bg-cyan-900/50 hover:bg-cyan-800 text-cyan-300 px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg border border-cyan-500/50 transition-all"
                    >
                        <Home size={18} />
                        <span>返回基地</span>
                    </button>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default DialogLayer;
