
import React from 'react';
import { ScriptStep } from './types';
import InteractiveVMLab from './InteractiveVMLab';
import { Image as ImageIcon, Box, Activity, BatteryCharging, Zap, Smartphone } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-orange-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-orange-50 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-orange-600/20 shadow-inner relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-amber-100/50"></div>
                <Box size={80} className="text-orange-700/20" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-orange-800 flex items-center gap-1">
                    AI_SCENE_GEN
                </div>
            </div>
            <p className="text-xl font-bold text-orange-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-orange-200/50">
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
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">ViewModel.kt</span>
                </div>
            </div>
            <div className="overflow-auto p-6 custom-scrollbar bg-[#0f172a]">
                <pre className="text-sm md:text-base font-mono leading-loose text-orange-100 whitespace-pre-wrap">
                {viewContent.codeSnippet}
                </pre>
            </div>
          </div>
        );

      case 'INTERACTIVE_LAB':
        if (!viewContent.interactiveConfig) return <div>Error: No Config</div>;
        return (
          <InteractiveVMLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-orange-100 animate-in zoom-in duration-500 w-full mb-24">
                     <Box size={60} className="text-orange-600 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-orange-800 mb-6 tracking-tight">露营手册：ViewModel 架构</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold">
                                 <Activity size={20} />
                                 <h3>ViewModel</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 状态的保险箱。它独立于 UI 生命周期，在配置变更（如屏幕旋转）时存活。负责持有数据和业务逻辑。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold">
                                 <Zap size={20} />
                                 <h3>StateFlow</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 数据管道。ViewModel 内部使用 <code>MutableStateFlow</code> 更新数据，外部暴露只读的 <code>StateFlow</code> 给 UI 订阅。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                                 <BatteryCharging size={20} />
                                 <h3>Lifecycle Safety</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 使用 <code>collectAsStateWithLifecycle()</code>。它能在 App 进入后台时自动停止数据收集，节省宝贵的电量和资源。
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
                     <Box size={120} className="text-orange-600 mb-6 drop-shadow-xl" />
                     <h1 className="text-5xl font-black text-orange-800 mb-4 tracking-tight">Supplies Secured!</h1>
                     <p className="text-xl text-orange-700 font-bold">
                        你建造了最坚固的营地！<br/>无论风吹雨打，数据安然无恙！
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
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-orange-200/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;
