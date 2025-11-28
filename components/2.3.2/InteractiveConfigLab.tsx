
import React, { useState } from 'react';
import { InteractiveState } from './types';
import { Smartphone, RefreshCw, Archive, AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveConfigLab: React.FC<Props> = ({ config, onComplete }) => {
  const [quizAnswer, setQuizAnswer] = useState<'A' | 'B' | 'C' | null>(null);
  const [isRotated, setIsRotated] = useState(false);
  const [countNormal, setCountNormal] = useState(0);
  const [countSaved, setCountSaved] = useState(0);
  const [activityStatus, setActivityStatus] = useState<'ALIVE' | 'DESTROYED' | 'RECREATED'>('ALIVE');
  const [labCompleted, setLabCompleted] = useState(false);

  // === QUIZ 1: SCENARIO ===
  if (config.mode === 'QUIZ_SCENARIO') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
         <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl w-full border-4 border-teal-100">
             <h3 className="text-xl font-bold text-teal-800 mb-6 flex items-center gap-2">
                 <HelpCircle /> 营地小测验 (1/2)
             </h3>
             <p className="text-slate-700 mb-6 text-lg font-medium leading-relaxed">
                 用户填写注册表单到一半，突然切换了手机的“深色模式”（导致 Activity 重建）。
                 如果你只使用了 <code>remember {'{'} mutableStateOf("") {'}'}</code>，结果会怎样？
             </p>

             <div className="flex flex-col gap-3">
                 <button 
                    onClick={() => setQuizAnswer('A')}
                    disabled={quizAnswer === 'B'}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${quizAnswer === 'A' ? 'bg-red-50 border-red-500 text-red-700' : 'border-slate-200 hover:border-teal-300'}`}
                 >
                     <span className="font-bold mr-2">A.</span> 姓名依然还在，用户体验良好。
                 </button>
                 <button 
                    onClick={() => { setQuizAnswer('B'); setTimeout(onComplete, 2000); }}
                    disabled={quizAnswer === 'B'}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${quizAnswer === 'B' ? 'bg-green-50 border-green-500 text-green-700 shadow-md transform scale-105' : 'border-slate-200 hover:border-teal-300'}`}
                 >
                     <span className="font-bold mr-2">B.</span> 姓名清空了，用户需要重新输入。
                 </button>
             </div>

             {quizAnswer === 'A' && (
                 <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                     <XCircle size={16}/> 错误。remember 无法跨越 Activity 的销毁重建。
                 </div>
             )}
             {quizAnswer === 'B' && (
                 <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm flex items-center gap-2 animate-bounce">
                     <CheckCircle2 size={16}/> 正确！数据丢失了，用户会很生气。
                 </div>
             )}
         </div>
      </div>
    );
  }

  // === QUIZ 2: TYPE SAFETY ===
  if (config.mode === 'QUIZ_TYPE_SAFETY') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
         <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl w-full border-4 border-teal-100">
             <h3 className="text-xl font-bold text-teal-800 mb-6 flex items-center gap-2">
                 <HelpCircle /> 营地小测验 (2/2)
             </h3>
             <p className="text-slate-700 mb-6 text-lg font-medium leading-relaxed">
                 以下哪种代码会导致 App 崩溃 (Crash)？
             </p>

             <div className="flex flex-col gap-3">
                 <button 
                    onClick={() => setQuizAnswer('A')}
                    disabled={quizAnswer === 'C'}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${quizAnswer === 'A' ? 'bg-red-50 border-red-500 text-red-700' : 'border-slate-200 hover:border-teal-300'}`}
                 >
                     <span className="font-bold mr-2">A.</span> <code>rememberSaveable {'{'} mutableStateOf("Alice") {'}'}</code>
                 </button>
                 <button 
                    onClick={() => setQuizAnswer('B')}
                    disabled={quizAnswer === 'C'}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${quizAnswer === 'B' ? 'bg-red-50 border-red-500 text-red-700' : 'border-slate-200 hover:border-teal-300'}`}
                 >
                     <span className="font-bold mr-2">B.</span> <code>rememberSaveable {'{'} mutableStateOf(25) {'}'}</code>
                 </button>
                 <button 
                    onClick={() => { setQuizAnswer('C'); setTimeout(onComplete, 2500); }}
                    disabled={quizAnswer === 'C'}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${quizAnswer === 'C' ? 'bg-green-50 border-green-500 text-green-700 shadow-md transform scale-105' : 'border-slate-200 hover:border-teal-300'}`}
                 >
                     <span className="font-bold mr-2">C.</span> <code>rememberSaveable {'{'} mutableStateOf(Socket()) {'}'}</code>
                 </button>
             </div>

             {quizAnswer && quizAnswer !== 'C' && (
                 <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm flex items-center gap-2">
                     <XCircle size={16}/> 错误。基本类型 (String, Int) 是可以直接保存到 Bundle 的。
                 </div>
             )}
             {quizAnswer === 'C' && (
                 <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm flex items-center gap-2 animate-bounce">
                     <CheckCircle2 size={16}/> 正确！Socket 不是 Parcelable，无法序列化存入 Bundle，会导致 Crash。
                 </div>
             )}
         </div>
      </div>
    );
  }

  // === COMPARISON LAB ===
  const handleRotate = () => {
    // 1. Destroy Phase
    setActivityStatus('DESTROYED');
    setTimeout(() => {
        // 2. Recreate Phase
        setIsRotated(prev => !prev);
        setActivityStatus('RECREATED');
        
        // LOGIC: remember dies, rememberSaveable lives
        setCountNormal(0);
        // countSaved stays the same

        if (countSaved > 0) {
            setLabCompleted(true);
            setTimeout(onComplete, 2000);
        }
    }, 800);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 gap-6 overflow-y-auto pb-32 custom-scrollbar">
       
       {/* Instruction */}
       <div className="bg-teal-50 text-teal-800 px-6 py-2 rounded-full font-bold text-sm shadow-sm flex items-center gap-2">
           <span className="bg-white px-2 rounded-full text-xs border border-teal-200">任务</span>
           把两个计数器都点到 5 以上，然后点击“旋转屏幕”。
       </div>

       {/* Phone Simulator */}
       <div className={`relative transition-all duration-700 ease-in-out shrink-0
           ${isRotated ? 'w-[450px] h-[220px]' : 'w-[280px] h-[450px]'}
       `}>
           {/* Phone Frame */}
           <div className={`
                w-full h-full bg-slate-800 rounded-[2rem] border-[8px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col
                ${activityStatus === 'DESTROYED' ? 'scale-90 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'}
                transition-all duration-500
           `}>
               {/* Screen Content */}
               <div className="flex-1 bg-slate-50 relative flex flex-col p-4 overflow-y-auto">
                   <div className="text-center mb-4">
                       <h3 className="font-bold text-slate-700">Counter App</h3>
                       <div className="text-[10px] text-slate-400 font-mono">Process ID: {activityStatus === 'RECREATED' ? '9021 (New)' : '4532'}</div>
                   </div>

                   <div className={`flex gap-4 ${isRotated ? 'flex-row' : 'flex-col'}`}>
                       
                       {/* Counter 1: Normal */}
                       <div className="flex-1 bg-red-50 border-2 border-red-100 rounded-xl p-3 flex flex-col items-center gap-2">
                           <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">remember</span>
                           <span className="text-3xl font-black text-slate-700">{countNormal}</span>
                           <button 
                               onClick={() => setCountNormal(n => n + 1)}
                               className="w-full py-2 bg-white border border-red-200 rounded-lg text-red-500 font-bold hover:bg-red-50 active:scale-95 text-xs"
                           >
                               +1 (RAM)
                           </button>
                       </div>

                       {/* Counter 2: Saveable */}
                       <div className="flex-1 bg-green-50 border-2 border-green-100 rounded-xl p-3 flex flex-col items-center gap-2">
                           <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">rememberSaveable</span>
                           <span className="text-3xl font-black text-slate-700">{countSaved}</span>
                           <button 
                               onClick={() => setCountSaved(n => n + 1)}
                               className="w-full py-2 bg-white border border-green-200 rounded-lg text-green-600 font-bold hover:bg-green-50 active:scale-95 text-xs"
                           >
                               +1 (Bundle)
                           </button>
                       </div>
                   </div>
               </div>
           </div>

           {/* Rotate Button */}
           <button 
             onClick={handleRotate}
             className="absolute -right-16 top-1/2 -translate-y-1/2 bg-teal-600 p-4 rounded-full shadow-xl text-white hover:bg-teal-500 hover:rotate-180 transition-all duration-500 z-20"
           >
               <RefreshCw size={24} />
           </button>
       </div>

       {/* Comparison Feedback */}
       <div className={`w-full max-w-xl rounded-2xl border-l-8 p-5 shadow-md flex flex-col gap-2 transition-all shrink-0 bg-white border-slate-200`}>
           <div className="flex items-center gap-2 mb-2">
               <Archive size={18} className="text-teal-600"/>
               <h4 className="font-bold text-slate-700">状态快照 / State Snapshot</h4>
           </div>
           
           <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className={`${activityStatus === 'RECREATED' && countNormal === 0 ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                    Normal: {countNormal}
                    {activityStatus === 'RECREATED' && countNormal === 0 && " (LOST)"}
                </div>
                <div className={`${activityStatus === 'RECREATED' && countSaved > 0 ? 'text-green-600 font-bold' : 'text-slate-500'}`}>
                    Saved: {countSaved}
                    {activityStatus === 'RECREATED' && countSaved > 0 && " (RESTORED)"}
                </div>
           </div>

           {labCompleted && (
               <div className="mt-2 bg-teal-50 text-teal-800 p-3 rounded-lg text-sm font-medium animate-pulse">
                   🎉 实验成功！普通变量归零了，但 Saveable 的数据活下来了！
               </div>
           )}
       </div>

    </div>
  );
};

export default InteractiveConfigLab;
