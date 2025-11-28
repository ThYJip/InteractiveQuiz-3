
import React from 'react';
import { ScriptStep } from './types';
import InteractiveManualLab from './InteractiveManualLab';
import { Image as ImageIcon, Gamepad2, Zap, LayoutTemplate } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-cyan-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-slate-900 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-black"></div>
                <Gamepad2 size={80} className="text-cyan-500/20 group-hover:text-cyan-400/40 transition-colors duration-700" />
                <div className="absolute bottom-4 right-4 bg-cyan-900/50 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 flex items-center gap-1 border border-cyan-500/30">
                    AI_VISUAL
                </div>
            </div>
            <p className="text-xl font-bold text-cyan-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-cyan-200/50">
                {viewContent.imagePrompt}
            </p>
          </div>
        );

      case 'CODE_EXPLAIN':
        return (
          <div className="w-full max-w-3xl bg-[#0f172a] rounded-2xl shadow-2xl overflow-hidden border-4 border-cyan-900 flex flex-col max-h-full transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">ManualScope.kt</span>
                </div>
            </div>
            <div className="overflow-auto p-6 custom-scrollbar bg-[#020617]">
                <pre className="text-sm md:text-base font-mono leading-loose text-cyan-100 whitespace-pre-wrap">
                {viewContent.codeSnippet}
                </pre>
            </div>
          </div>
        );

      case 'INTERACTIVE_LAB':
        if (!viewContent.interactiveConfig) return <div>Error: No Config</div>;
        return (
          <InteractiveManualLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-slate-900/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-cyan-500/50 animate-in zoom-in duration-500 w-full mb-24 text-white">
                     <Gamepad2 size={60} className="text-cyan-400 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-cyan-200 mb-6 tracking-tight">驾驶手册：手动协程</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-slate-800 p-5 rounded-2xl border border-cyan-900 shadow-sm">
                             <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold">
                                 <Zap size={20} />
                                 <h3>回调地狱救星</h3>
                             </div>
                             <p className="text-sm text-slate-400 leading-relaxed">
                                 <code>onClick</code> 是普通函数，无法直接调用挂起函数。必须使用 Scope 启动协程来作为桥梁。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-slate-800 p-5 rounded-2xl border border-cyan-900 shadow-sm">
                             <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold">
                                 <LayoutTemplate size={20} />
                                 <h3>生命周期绑定</h3>
                             </div>
                             <p className="text-sm text-slate-400 leading-relaxed">
                                 <code>rememberCoroutineScope</code> 创建的 Scope 绑定了 Composable 的生命周期。离开界面时自动取消，防止内存泄漏。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-slate-800 p-5 rounded-2xl border border-cyan-900 col-span-1 md:col-span-2 shadow-sm">
                             <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold">
                                 <Gamepad2 size={20} />
                                 <h3>使用场景</h3>
                             </div>
                             <p className="text-sm text-slate-400 leading-relaxed">
                                 所有由<b>用户交互</b>触发的异步任务（点击按钮、手势操作）都应该使用 <code>rememberCoroutineScope</code>。自动运行的任务则用 <code>LaunchedEffect</code>。
                             </p>
                         </div>
                     </div>
                 </div>
             </div>
         );

      case 'VICTORY':
         return (
             <div className="w-full h-full flex flex-col items-center justify-center p-4">
                 <div className="text-center animate-bounce flex flex-col items-center p-8 bg-slate-900/80 backdrop-blur-md rounded-[3rem] shadow-[0_0_50px_rgba(6,182,212,0.5)] border-4 border-cyan-400 mb-6">
                     <Gamepad2 size={120} className="text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                     <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Manual Control!</h1>
                     <p className="text-xl text-cyan-200 font-bold">
                        你已完全掌控了协程驾驶舱！<br/>操作行云流水！
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
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-cyan-900/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;
