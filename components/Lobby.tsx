import React from 'react';
import { Layers, Share2, Sparkles, Zap, BrainCircuit, Smartphone, Backpack, List, Tags, Radio, LayoutTemplate, Hammer, PenTool } from 'lucide-react';

interface Props {
  onSelectLesson: (lessonId: string) => void;
}

const Lobby: React.FC<Props> = ({ onSelectLesson }) => {
  return (
    <div className="w-full h-screen bg-[#FDF6E3] overflow-y-auto font-sans selection:bg-orange-200">
      <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-12 mt-4 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">
            Yuru Camp: Code Chronicles
          </h1>
          <p className="text-slate-500 font-medium tracking-wide">
            选择你的冒险章节 / Choose Your Adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl w-full">
          
          {/* Card 1: Coroutine Scopes (Cyber Theme Mapping) */}
          <button 
            onClick={() => onSelectLesson('4.1.2')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-cyan-100 hover:border-cyan-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-100 rounded-full blur-2xl group-hover:bg-cyan-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 group-hover:scale-110 transition-transform duration-500">
                <Zap size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-cyan-700 transition-colors">
                4.1.2 协程作用域
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                跟随凛学习 structured concurrency。理解生命周期，拒绝内存泄漏！
              </p>
              
              <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm">
                <Sparkles size={16} />
                <span>进阶并发 (Cyber Mode)</span>
              </div>
            </div>
          </button>

          {/* Card 2: State Hoisting (Cozy Theme Mapping) */}
          <button 
            onClick={() => onSelectLesson('2.4.2')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-orange-100 hover:border-orange-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-2xl group-hover:bg-orange-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform duration-500">
                <Share2 size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-orange-700 transition-colors">
                2.4.2 状态提升
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                和抚子一起点亮共享提灯。学习单向数据流与无状态组件设计。
              </p>
              
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                <Layers size={16} />
                <span>Compose 基础 (Cozy Mode)</span>
              </div>
            </div>
          </button>

          {/* Card 3: Remember (Forest Theme Mapping) */}
          <button 
            onClick={() => onSelectLesson('2.3.1')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-green-100 hover:border-green-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full blur-2xl group-hover:bg-green-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-500">
                <BrainCircuit size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-green-700 transition-colors">
                2.3.1 Remember 函数
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                抚子的松果怎么不见了？深入理解重组机制与状态持久化。
              </p>
              
              <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                <Layers size={16} />
                <span>Compose 核心 (Cozy Forest)</span>
              </div>
            </div>
          </button>

          {/* Card 4: Config Changes (Forest/Backpack Theme) */}
          <button 
            onClick={() => onSelectLesson('2.3.2')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-emerald-100 hover:border-emerald-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-2xl group-hover:bg-emerald-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                <Backpack size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                2.3.2 配置变更
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                旋转屏幕导致数据丢失？使用 rememberSaveable 打造防风背包！
              </p>
              
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Smartphone size={16} />
                <span>生命周期 (Cozy Forest)</span>
              </div>
            </div>
          </button>

          {/* Card 5: LazyColumn (Amber/Snack Theme) */}
          <button 
            onClick={() => onSelectLesson('3.1.1')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-amber-100 hover:border-amber-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-100 rounded-full blur-2xl group-hover:bg-amber-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform duration-500">
                <List size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
                3.1.1 高效列表 LazyColumn
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                聪明地打包！处理 1000 个列表项不卡顿的秘密——虚拟化技术。
              </p>
              
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Backpack size={16} />
                <span>列表组件 (Cozy Camp)</span>
              </div>
            </div>
          </button>

           {/* Card 6: Heterogeneous Lists (Indigo/Tag Theme) */}
           <button 
            onClick={() => onSelectLesson('3.1.2')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-indigo-100 hover:border-indigo-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-2xl group-hover:bg-indigo-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                <Tags size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                3.1.2 异构列表与 Key
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                当列表变得复杂... 为什么我的 Checkbox 乱跑了？解密 Key 的重要性！
              </p>
              
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <List size={16} />
                <span>进阶列表 (Cozy Camp)</span>
              </div>
            </div>
          </button>

           {/* Card 7: Scroll Control (Teal/Signal Theme) */}
           <button 
            onClick={() => onSelectLesson('3.1.3')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-teal-100 hover:border-teal-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100 rounded-full blur-2xl group-hover:bg-teal-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600 group-hover:scale-110 transition-transform duration-500">
                <Radio size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                3.1.3 滚动控制与吸顶
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                列表的遥控器！使用 LazyListState 控制滚动，实现 stickyHeader 吸顶效果。
              </p>
              
              <div className="flex items-center gap-2 text-teal-600 font-bold text-sm">
                <List size={16} />
                <span>进阶列表 (Cozy Camp)</span>
              </div>
            </div>
          </button>

          {/* Card 8: Slot API (Purple/Bento Theme) */}
          <button 
            onClick={() => onSelectLesson('3.2.1')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-purple-100 hover:border-purple-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-2xl group-hover:bg-purple-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-500">
                <LayoutTemplate size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">
                3.2.1 插槽 API 模式
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                拒绝死板的便当盒！学习使用 Slot API 构建高复用、灵活的组件。
              </p>
              
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                <Layers size={16} />
                <span>UI 模式 (Cozy Camp)</span>
              </div>
            </div>
          </button>

          {/* Card 9: Scaffold (Blue/Construction Theme) */}
          <button 
            onClick={() => onSelectLesson('3.2.2')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-blue-100 hover:border-blue-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-2xl group-hover:bg-blue-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                <Hammer size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                3.2.2 Scaffold 脚手架
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                告别手搭骨架！拥抱标准化的页面结构。千万别忘了 PaddingValues 的契约！
              </p>
              
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <LayoutTemplate size={16} />
                <span>页面布局 (Cozy Camp)</span>
              </div>
            </div>
          </button>

          {/* Card 10: TextField (Pink/Pen Theme) */}
          <button 
            onClick={() => onSelectLesson('3.3.1')}
            className="group relative bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-[3px] border-pink-100 hover:border-pink-300 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full blur-2xl group-hover:bg-pink-200 transition-colors opacity-60"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform duration-500">
                <PenTool size={32} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-pink-700 transition-colors">
                3.3.1 文本输入与状态
              </h2>
              <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                给千明写明信片！理解 TextField 的单向数据流机制，打造完美的表单。
              </p>
              
              <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
                <Layers size={16} />
                <span>交互组件 (Cozy Camp)</span>
              </div>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="mt-16 text-slate-400 text-sm font-medium pb-8">
          © 2024 Yuru Camp Code Academy
        </div>
      </div>
    </div>
  );
};

export default Lobby;