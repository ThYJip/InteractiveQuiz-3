
import React from 'react';
import { ScriptStep } from './types';
import InteractiveLazyLab from './InteractiveLazyLab';
import { Image as ImageIcon, List, Box, Layers, Zap } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center h-full text-amber-900 overflow-y-auto p-4">
            <div className="w-80 h-64 bg-amber-50 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-dashed border-amber-600/20 shadow-inner relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50"></div>
                <List size={80} className="text-amber-700/20" />
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs font-mono text-amber-800 flex items-center gap-1">
                    AI_SCENE_GEN
                </div>
            </div>
            <p className="text-xl font-bold text-amber-900/80 text-center max-w-lg leading-relaxed bg-white/60 px-6 py-4 rounded-2xl backdrop-blur-sm shadow-sm border border-amber-200/50">
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
                    <span className="text-xs text-slate-400 ml-3 font-mono font-bold tracking-wider">SnackList.kt</span>
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
          <InteractiveLazyLab 
            key={step.id} 
            config={viewContent.interactiveConfig} 
            onComplete={onInteractiveComplete}
          />
        );
      
      case 'TECH_SUMMARY':
         return (
             <div className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar p-4 flex flex-col items-center">
                 <div className="text-center flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-amber-100 animate-in zoom-in duration-500 w-full mb-24">
                     <List size={60} className="text-amber-600 mb-4" />
                     <h1 className="text-2xl md:text-3xl font-black text-amber-800 mb-6 tracking-tight">露营手册：LazyColumn 核心奥义</h1>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                         {/* Card 1 */}
                         <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
                                 <Zap size={20} />
                                 <h3>Virtualization (虚拟化)</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 LazyColumn 只会创建和渲染屏幕上可见的组件。当组件滑出屏幕时，其内存会被回收利用。这是性能的关键。
                             </p>
                         </div>

                         {/* Card 2 */}
                         <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-green-800 font-bold">
                                 <Box size={20} />
                                 <h3>DSL 声明式语法</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 使用 <code>items(list)</code> 而不是 <code>for</code> 循环。告诉 Compose "你想展示什么"，而不是"怎么去画"。
                             </p>
                         </div>

                         {/* Card 3 */}
                         <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 col-span-1 md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex items-center gap-2 mb-2 text-purple-800 font-bold">
                                 <Layers size={20} />
                                 <h3>Content Padding</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed">
                                 永远使用 <code>contentPadding</code> 参数来添加列表内部的留白，而不是在外部使用 <code>Modifier.padding</code>，否则会导致滚动内容在边缘被“裁切”。
                             </p>
                         </div>
                     </div>
                 </div>
             </div>
         );

      case 'VICTORY':
         return (
             <div className="text-center animate-bounce flex flex-col items-center p-8 bg-white/60 backdrop-blur-md rounded-[3rem] shadow-2xl border-4 border-white">
                 <Box size={120} className="text-amber-600 mb-6 drop-shadow-xl" />
                 <h1 className="text-5xl font-black text-amber-800 mb-4 tracking-tight">Packed & Ready!</h1>
                 <p className="text-xl text-amber-700 font-bold">
                    1000 个零食已经打包完毕！<br/>你的列表现在丝般顺滑！
                 </p>
             </div>
         )

      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 relative z-0" style={{ height: 'calc(100vh - 240px)' }}>
      {/* Background Decor */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-amber-200/40 to-transparent -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full max-w-6xl flex items-center justify-center pt-4 md:pt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StageLayer;
