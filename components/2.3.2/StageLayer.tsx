
import React from 'react';
import { ScriptStep } from './types';
import InteractiveConfigLab from './InteractiveConfigLab';
import { Image as ImageIcon, Wind, ShieldCheck, BookOpen } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-teal-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-teal-50 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-teal-600/20 shadow-inner relative overflow-hidden group shrink-0">
                <Wind size={100} className="text-teal-700/30 animate-pulse" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-teal-800 flex items-center gap-1">
                    AI_SCENE_GEN
                </div>
            </div>
            <p className="text-xl font-bold text-teal-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-teal-200/50">
                {viewContent.imagePrompt}
            </p>
          </div>
        );

      case 'CODE_EXPLAIN':
        return (
          <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-800 flex flex-col max-h-full">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">ConfigChanges.kt</span>
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
          <InteractiveConfigLab 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
    
      case 'VICTORY':
         return (
             <div className="text-center flex flex-col items-center p-8 bg-white/60 backdrop-blur-md rounded-[3rem] shadow-2xl border-4 border-white animate-in zoom-in duration-500 max-w-2xl w-full">
                 <ShieldCheck size={80} className="text-teal-600 mb-4 drop-shadow-xl" />
                 <h1 className="text-4xl font-black text-teal-800 mb-2 tracking-tight">Mission Complete!</h1>
                 <p className="text-lg text-teal-700 font-bold mb-6">
                    你已经掌握了如何在“狂风”中保护数据！
                 </p>
                 
                 {/* Learning Summary Card */}
                 <div className="bg-white/80 p-6 rounded-2xl shadow-inner border border-teal-100 w-full text-left">
                    <h3 className="font-bold text-teal-800 mb-3 flex items-center gap-2 border-b border-teal-100 pb-2">
                        <BookOpen size={20}/> 本节收获 (Key Takeaways)
                    </h3>
                    <ul className="space-y-3 text-slate-600 text-sm">
                        <li className="flex gap-3 items-start">
                            <span className="bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded text-xs mt-0.5 shrink-0">Concept</span>
                            <span><b>Slot Table vs Bundle</b>: remember 存内存 (Activity 死则死)，rememberSaveable 存硬盘/Bundle (Activity 死则生)。</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs mt-0.5 shrink-0">Limit</span>
                            <span><b>存储限制</b>: Bundle 只能存基本类型和 Parcelable。复杂对象需要转换。</span>
                        </li>
                        <li className="flex gap-3 items-start">
                            <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-xs mt-0.5 shrink-0">Action</span>
                            <span><b>最佳实践</b>: 用户输入的表单、滚动位置、Tab 选择，统统用 rememberSaveable。</span>
                        </li>
                    </ul>
                 </div>
             </div>
         )

      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 relative z-0" style={{ height: 'calc(100vh - 240px)' }}>
      {/* Background Decor */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-teal-200/30 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;
