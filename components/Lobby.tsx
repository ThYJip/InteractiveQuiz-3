import React from 'react';
import { Layers, Share2, Sparkles, Zap, BrainCircuit } from 'lucide-react';

interface Props {
  onSelectLesson: (lessonId: string) => void;
}

const Lobby: React.FC<Props> = ({ onSelectLesson }) => {
  return (
    <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-orange-200">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">
          Yuru Camp: Code Chronicles
        </h1>
        <p className="text-slate-500 font-medium tracking-wide">
          选择你的冒险章节 / Choose Your Adventure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        
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

      </div>

      {/* Footer */}
      <div className="mt-16 text-slate-400 text-sm font-medium">
        © 2024 Yuru Camp Code Academy
      </div>
    </div>
  );
};

export default Lobby;