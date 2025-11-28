
import React from 'react';
import { ScriptStep } from './types';
import InteractiveModelLab from './InteractiveModelLab';
import { Image as ImageIcon, Database, Box, Server, Shield } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-violet-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-violet-50 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-violet-600/20 shadow-inner relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-fuchsia-100/50"></div>
                <Database size={80} className="text-violet-700/20" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-violet-800 flex items-center gap-1">
                    AI_SCENE_GEN
                </div>
            </div>
            <p className="text-xl font-bold text-violet-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-violet-200/50">
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
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">UiState.kt</span>
                </div>
            </div>
            <div className="overflow-auto p-6 custom-scrollbar bg-[#0f172a]">
                <pre className="text-sm md:text-base font-mono leading-loose text-violet-100 whitespace-pre-wrap">
                {viewContent.codeSnippet}
                </pre>
            </div>
          </div>
        );

      case 'INTERACTIVE_LAB':
        if (!viewContent.interactiveConfig) return <div>Error: No Config</div>;
        return (
          <InteractiveModelLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-violet-100 animate-in zoom-in duration-500 w-full mb-24">
                     <Database size={60} className="text-violet-600 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-violet-800 mb-6 tracking-tight">露营手册：状态建模</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-violet-50 p-5 rounded-2xl border border-violet-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-violet-800 font-bold">
                                 <Box size={20} />
                                 <h3>Data Class</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 当状态是“共存”的时候使用（如：列表内容 + 过滤选项）。使用 <code>.copy()</code> 进行原子化更新，防止状态竞争。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-fuchsia-50 p-5 rounded-2xl border border-fuchsia-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-fuchsia-800 font-bold">
                                 <Shield size={20} />
                                 <h3>Sealed Interface</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 当状态是“互斥”的时候使用（如：加载中 / 成功 / 失败）。这被称为 LCE 模式，结合 <code>when</code> 表达式使用，类型安全。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                                 <Server size={20} />
                                 <h3>Single Source of Truth</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 无论哪种模型，原则都是：ViewModel 暴露单一的 <code>StateFlow&lt;UiState&gt;</code>，UI 只负责订阅和渲染。不要把状态分散成几十个变量。
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
                     <Database size={120} className="text-violet-600 mb-6 drop-shadow-xl" />
                     <h1 className="text-5xl font-black text-violet-800 mb-4 tracking-tight">State Architect!</h1>
                     <p className="text-xl text-violet-700 font-bold">
                        你构建了完美的数据结构！<br/>逻辑坚不可摧！
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
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-violet-200/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;
