
import React from 'react';
import { ScriptStep } from './types';
import InteractiveEffectLab from './InteractiveEffectLab';
import { Image as ImageIcon, Zap, Shield, Repeat, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-indigo-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-indigo-50 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-indigo-600/20 shadow-inner relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-100/50"></div>
                <Zap size={80} className="text-indigo-700/20" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-indigo-800 flex items-center gap-1">
                    AI_SCENE_GEN
                </div>
            </div>
            <p className="text-xl font-bold text-indigo-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-indigo-200/50">
                {viewContent.imagePrompt}
            </p>
          </div>
        );

      case 'CODE_EXPLAIN':
        return (
          <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-800 flex flex-col max-h-full transform -rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">EffectDemo.kt</span>
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
          <InteractiveEffectLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-indigo-100 animate-in zoom-in duration-500 w-full mb-24">
                     <Shield size={60} className="text-indigo-600 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-indigo-800 mb-6 tracking-tight">露营手册：Side Effects</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-indigo-800 font-bold">
                                 <AlertTriangle size={20} />
                                 <h3>Side Effect (副作用)</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 除了返回值之外的操作（网络请求、日志、计时器）。在 Compose 中必须受控执行，否则会随重组无限触发。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-purple-800 font-bold">
                                 <Shield size={20} />
                                 <h3>LaunchedEffect</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 安全的避风港。只在进入界面（Enter Composition）时启动协程，离开时自动取消。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                                 <RefreshCw size={20} />
                                 <h3>Key (重启开关)</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 <code>LaunchedEffect(key)</code>。当 key 变化时，旧协程取消，新协程启动。常用于 userId 变化时重新拉取数据。
                             </p>
                         </div>
                     </div>
                 </div>
             </div>
         );

      case 'VICTORY':
         return (
             <div className="w-full h-full flex flex-col items-center justify-center p-4">
                 <div className="text-center animate-bounce flex flex-col items-center p-8 bg-white/60 backdrop-blur-md rounded-[3rem] shadow-2xl border-4 border-white mb-6">
                     <Zap size={120} className="text-indigo-600 mb-6 drop-shadow-xl" />
                     <h1 className="text-5xl font-black text-indigo-800 mb-4 tracking-tight">Storm Survived!</h1>
                     <p className="text-xl text-indigo-700 font-bold">
                        你掌握了副作用的控制权！<br/>程序稳如泰山！
                     </p>
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
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-indigo-200/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;
