import React, { useState, useEffect } from 'react';
import { Speaker } from './types';
import { Ghost, Tent, User, ArrowRight } from 'lucide-react';

interface Props {
  speaker: Speaker;
  text: string;
  onNext: () => void;
  canProceed: boolean;
}

const DialogLayer: React.FC<Props> = ({ speaker, text, onNext, canProceed }) => {
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

  // Skip typing on click logic could be added here
  
  const getAvatar = () => {
    switch (speaker) {
      case 'Rin':
        return <div className="bg-camp-rin p-2 rounded-full border-4 border-white shadow-lg"><User size={48} className="text-white" /></div>;
      case 'Nadeshiko':
        return <div className="bg-camp-nadeshiko p-2 rounded-full border-4 border-white shadow-lg"><Ghost size={48} className="text-white" /></div>; 
      case 'Sensei': 
      case 'System':
        return <div className="bg-camp-sensei p-2 rounded-full border-4 border-white shadow-lg"><Tent size={48} className="text-white" /></div>;
      default:
        return <div className="bg-gray-400 p-2 rounded-full"><User size={48} /></div>;
    }
  };

  const getNameColor = () => {
      switch(speaker) {
          case 'Rin': return 'text-blue-300';
          case 'Nadeshiko': return 'text-pink-300';
          default: return 'text-green-300';
      }
  }

  const getDisplayName = () => {
      switch(speaker) {
          case 'Rin': return '志摩 凛';
          case 'Nadeshiko': return '各务原 抚子';
          case 'System': return '>> 系统通知';
          default: return speaker;
      }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-[30%] min-h-[220px] z-50 flex justify-center pb-6 px-4 pointer-events-none">
      <div className="w-full max-w-5xl relative pointer-events-auto">
        
        {/* Avatar Positioned Absolute */}
        <div className="absolute -top-12 left-6 md:left-12 z-20 transform transition-transform duration-500 hover:scale-110">
           {getAvatar()}
        </div>

        {/* Dialog Box */}
        <div className="w-full h-full glass-panel rounded-2xl shadow-2xl flex flex-col p-6 pt-12 md:p-8 md:pt-10 relative overflow-hidden ring-1 ring-white/20">
            
            {/* Speaker Name */}
            <h3 className={`font-bold text-lg mb-3 font-mono tracking-wide ${getNameColor()} flex items-center gap-2`}>
                {getDisplayName()}
            </h3>

            {/* Text Content */}
            <p className="text-lg md:text-xl text-white/95 leading-relaxed font-medium tracking-wide">
                {displayedText}
                <span className={`inline-block w-2 h-5 bg-camp-rin ml-1 align-middle ${isTyping ? 'animate-pulse' : 'hidden'}`}></span>
            </p>

            {/* Next Button */}
            {canProceed && !isTyping && (
                <button 
                    onClick={onNext}
                    className="absolute bottom-6 right-6 flex items-center gap-2 bg-camp-rin/20 hover:bg-camp-rin/40 text-white px-6 py-2 rounded-full transition-all border border-white/20 animate-bounce group"
                >
                    <span className="font-bold">下一步</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default DialogLayer;