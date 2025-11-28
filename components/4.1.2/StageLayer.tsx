import React from 'react';
import { ViewType, ScriptStep } from './types';
import InteractiveScopeLab from './InteractiveScopeLab';
import { Code, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface Props {
  step: ScriptStep;
  onInteractiveComplete: () => void;
}

const StageLayer: React.FC<Props> = ({ step, onInteractiveComplete }) => {
  const { viewType, viewContent } = step;

  const renderContent = () => {
    switch (viewType) {
      case 'IMAGE':
        return (
          <div className="flex flex-col items-center justify-center h-full text-camp-wood">
            <div className="w-64 h-64 bg-camp-wood/20 rounded-full flex items-center justify-center mb-4 border-4 border-dashed border-camp-wood/40 animate-pulse">
                <ImageIcon size={64} className="opacity-50" />
            </div>
            <p className="text-lg font-bold opacity-70 px-8 text-center max-w-lg leading-relaxed">{viewContent.imagePrompt}</p>
            <span className="text-xs mt-3 opacity-50 border border-camp-wood/30 px-3 py-1 rounded-full">(AI 概念图生成占位符)</span>
          </div>
        );

      case 'CODE_EXPLAIN':
        return (
          <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-full">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-3 font-mono">CampCoroutines.kt</span>
                </div>
                <div className="text-xs text-slate-500 font-mono">READ-ONLY</div>
            </div>
            <div className="overflow-auto p-6 custom-scrollbar">
                <pre className="text-sm md:text-base font-mono leading-relaxed text-blue-100 whitespace-pre-wrap">
                {viewContent.codeSnippet}
                </pre>
            </div>
          </div>
        );

      case 'INTERACTIVE_LAB':
        if (!viewContent.interactiveConfig) return <div>Error: No Config</div>;
        return (
          <InteractiveScopeLab 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
    
      case 'VICTORY':
         return (
             <div className="text-center animate-bounce flex flex-col items-center">
                 <CheckCircle size={100} className="text-camp-sensei mb-6 drop-shadow-lg" />
                 <h1 className="text-5xl font-black text-camp-wood mb-4 tracking-tight">Challenge Complete!</h1>
                 <p className="text-xl text-slate-600 font-bold bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm">
                    你已经成功掌握了协程作用域！
                 </p>
             </div>
         )

      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    // Changed height from h-[70vh] to calculated safe area to avoid Dialog overlap
    <div className="w-full flex items-center justify-center p-4 md:p-6 lg:p-8 relative z-0" style={{ height: 'calc(100vh - 260px)' }}>
      {/* Projection Screen Effect */}
      <div className="absolute inset-4 md:inset-8 bg-white/60 rounded-[2rem] -z-10 blur-xl"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;