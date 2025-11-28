
import React from 'react';
import { ScriptStep } from './types';
import InteractiveScrollLab from './InteractiveScrollLab';
import { Image as ImageIcon, Radio, Flag, CheckSquare, Zap, Layout } from 'lucide-react';

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
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-emerald-100/50"></div>
                <Radio size={80} className="text-teal-700/20" />
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
          <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-800 flex flex-col max-h-full transform -rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">ScrollControl.kt</span>
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
          <InteractiveScrollLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-teal-100 animate-in zoom-in duration-500 w-full mb-24">
                     <Radio size={60} className="text-teal-600 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-teal-800 mb-6 tracking-tight">露营手册：滚动与吸顶</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-teal-800 font-bold">
                                 <Radio size={20} />
                                 <h3>LazyListState</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 列表的“遥控器”。通过它，我们可以读取当前的滚动位置 (<code>firstVisibleItemIndex</code>)，或者命令列表滚动到指定位置 (<code>animateScrollToItem</code>)。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-indigo-800 font-bold">
                                 <Flag size={20} />
                                 <h3>Sticky Header</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 使用 <code>stickyHeader</code> DSL 可以轻松创建吸顶效果。非常适合用于分组列表（如通讯录、日期分组）。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
                                 <Zap size={20} />
                                 <h3>协程控制</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 滚动是一个<b>挂起函数</b> (suspend function)。在普通的 onClick 回调中，必须使用 <code>rememberCoroutineScope</code> 创建的 scope 来启动它：<code>scope.launch &#123; ... &#125;</code>。
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
                     <CheckSquare size={120} className="text-teal-600 mb-6 drop-shadow-xl" />
                     <h1 className="text-5xl font-black text-teal-800 mb-4 tracking-tight">Mission Accomplished!</h1>
                     <p className="text-xl text-teal-700 font-bold">
                        你现在是真正的列表指挥官！<br/>一切尽在掌握！
                     </p>
                 </div>
                 
                 {/* Mini Review Cards for MVP Screen */}
                 <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-3 opacity-90 animate-slide-up">
                    <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow flex items-center gap-3">
                         <div className="bg-teal-100 p-2 rounded-full"><Radio size={16} className="text-teal-600"/></div>
                         <span className="text-xs font-bold text-teal-900">LazyListState 遥控滚动</span>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow flex items-center gap-3">
                         <div className="bg-teal-100 p-2 rounded-full"><Flag size={16} className="text-teal-600"/></div>
                         <span className="text-xs font-bold text-teal-900">StickyHeader 分组吸顶</span>
                    </div>
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
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-teal-200/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;