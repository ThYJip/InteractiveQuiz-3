import React from 'react';
import { ScriptStep } from './types';
import InteractiveHoistingLab from './InteractiveHoistingLab';
import { Image as ImageIcon, CheckCircle, Map } from 'lucide-react';

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
            <div className="w-80 h-64 bg-white/50 rounded-3xl flex items-center justify-center mb-6 border-4 border-dashed border-camp-wood/20 shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/50 to-blue-100/50 opacity-50"></div>
                <ImageIcon size={80} className="text-camp-wood/30 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Map size={12} /> AI_GENERATED
                </div>
            </div>
            <p className="text-xl font-bold text-slate-700 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-white/40">
                {viewContent.imagePrompt}
            </p>
          </div>
        );

      case 'CODE_EXPLAIN':
        return (
          <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-800 flex flex-col max-h-full transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">ComposeCamp.kt</span>
                </div>
            </div>
            <div className="overflow-auto p-6 custom-scrollbar bg-[#0f172a]">
                <pre className="text-sm md:text-base font-mono leading-loose text-blue-100 whitespace-pre-wrap">
                {viewContent.codeSnippet}
                </pre>
            </div>
          </div>
        );

      case 'INTERACTIVE_LAB':
        if (!viewContent.interactiveConfig) return <div>Error: No Config</div>;
        return (
          <InteractiveHoistingLab 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
    
      case 'VICTORY':
         return (
             <div className="text-center animate-bounce flex flex-col items-center p-8 bg-white/40 backdrop-blur-md rounded-[3rem] shadow-2xl border-4 border-white/50">
                 <CheckCircle size={120} className="text-green-500 mb-6 drop-shadow-xl" />
                 <h1 className="text-5xl font-black text-slate-700 mb-4 tracking-tight">Camp Set Up!</h1>
                 <p className="text-xl text-slate-600 font-bold">
                    你已经掌握了“状态提升”！<br/>现在的你，是合格的露营队长了！
                 </p>
             </div>
         )

      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    // Safe area calculation for "Cozy Viewfinder" dialog which is quite tall
    <div className="w-full flex items-center justify-center p-4 relative z-0" style={{ height: 'calc(100vh - 320px)' }}>
      {/* Background Decor: A warm sun glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;