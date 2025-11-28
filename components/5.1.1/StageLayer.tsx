
import React from 'react';
import { ScriptStep } from './types';
import InteractiveNavLab from './InteractiveNavLab';
import { Image as ImageIcon, MapPin, Monitor, ArrowRight } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-rose-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-rose-50 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-rose-400 shadow-inner relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-orange-100/50"></div>
                <MapPin size={80} className="text-rose-700/20" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-rose-800 flex items-center gap-1">
                    AI_SCENE_GEN
                </div>
            </div>
            <p className="text-xl font-bold text-rose-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-rose-200/50">
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
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">Navigation.kt</span>
                </div>
            </div>
            <div className="overflow-auto p-6 custom-scrollbar bg-[#0f172a]">
                <pre className="text-sm md:text-base font-mono leading-loose text-rose-100 whitespace-pre-wrap">
                {viewContent.codeSnippet}
                </pre>
            </div>
          </div>
        );

      case 'INTERACTIVE_LAB':
        if (!viewContent.interactiveConfig) return <div>Error: No Config</div>;
        return (
          <InteractiveNavLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-rose-100 animate-in zoom-in duration-500 w-full mb-24">
                     <MapPin size={60} className="text-rose-600 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-rose-800 mb-6 tracking-tight">露营手册：导航基础</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold">
                                 <Monitor size={20} />
                                 <h3>NavHost (容器)</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 应用中唯一的“舞台”。它根据当前的 Route，从 NavGraph 中找到对应的 Composable 并显示出来。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold">
                                 <ArrowRight size={20} />
                                 <h3>NavController (遥控器)</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 管理回退栈 (Back Stack)。调用 <code>navigate()</code> 推入新页面，调用 <code>popBackStack()</code> 返回上页。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                                 <MapPin size={20} />
                                 <h3>Route (路由)</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 页面的唯一地址（字符串）。未来我们还会学习如何带参数（如 "profile/123"）。
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
                     <MapPin size={120} className="text-rose-600 mb-6 drop-shadow-xl" />
                     <h1 className="text-5xl font-black text-rose-800 mb-4 tracking-tight">Stage Set!</h1>
                     <p className="text-xl text-rose-700 font-bold">
                        你已搭建好了完美的导航舞台！<br/>好戏开场！
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
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-rose-200/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;
