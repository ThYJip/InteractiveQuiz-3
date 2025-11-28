
import React from 'react';
import { ScriptStep } from './types';
import InteractiveInputLab from './InteractiveInputLab';
import { Image as ImageIcon, PenTool, Edit3, Key, Type } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-pink-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-pink-50 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-pink-600/20 shadow-inner relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-rose-100/50"></div>
                <PenTool size={80} className="text-pink-700/20" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-pink-800 flex items-center gap-1">
                    AI_SCENE_GEN
                </div>
            </div>
            <p className="text-xl font-bold text-pink-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-pink-200/50">
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
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">InputFlow.kt</span>
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
          <InteractiveInputLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-pink-100 animate-in zoom-in duration-500 w-full mb-24">
                     <Edit3 size={60} className="text-pink-600 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-pink-800 mb-6 tracking-tight">露营手册：输入框与状态</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-pink-800 font-bold">
                                 <PenTool size={20} />
                                 <h3>受控组件</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 TextField 不存储状态。它只显示你给它的 <code>value</code>。当用户输入时，触发 <code>onValueChange</code>，你必须更新状态，TextField 才会改变显示。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold">
                                 <Type size={20} />
                                 <h3>Single Source of Truth</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 单一可信源原则。UI 和 逻辑 共享同一个 State 对象。消除了“UI 显示值”与“变量值”不一致的 Bug。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                                 <Key size={20} />
                                 <h3>视觉转换</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 使用 <code>VisualTransformation</code> (如 PasswordVisualTransformation) 可以在不改变底层状态的情况下，改变文本的显示方式。
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
                     <PenTool size={120} className="text-pink-600 mb-6 drop-shadow-xl" />
                     <h1 className="text-5xl font-black text-pink-800 mb-4 tracking-tight">Postcard Sent!</h1>
                     <p className="text-xl text-pink-700 font-bold">
                        你掌握了与用户“对话”的艺术！<br/>输入流畅无阻！
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
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-pink-200/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;