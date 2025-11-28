import React, { useState } from 'react';
import { InteractiveState } from './types';
import { AlertCircle, CheckCircle2, Trees, Plus } from 'lucide-react';

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveRememberLab: React.FC<Props> = ({ config, onComplete }) => {
  const isBugMode = config.mode === 'AMNESIA_BUG';

  // === BUG SIMULATION ===
  // simulating "var count = 0" in a recomposing function
  // In React, a local var inside component body resets on every render.
  let bugCount = 0; 
  // We use a dummy state just to trigger a re-render
  const [, forceUpdate] = useState(0);

  // Track attempts to unlock the next button in bug mode
  const [attempts, setAttempts] = useState(0);

  // === FIX SIMULATION ===
  // Equivalent to `remember { mutableStateOf(0) }`
  const [fixedCount, setFixedCount] = useState(0);

  const handleBugClick = () => {
    // In a real function execution:
    bugCount++; 
    console.log("Bug count (local):", bugCount);
    
    // Unlock progression after 3 frustrating clicks
    setAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 3) {
            onComplete();
        }
        return newAttempts;
    });

    // Trigger "Recomposition"
    forceUpdate(n => n + 1);
    // On next render, `let bugCount = 0` executes again, resetting visual.
  };

  const handleFixClick = () => {
    setFixedCount(prev => {
        const newVal = prev + 1;
        if (newVal >= 5) {
            setTimeout(onComplete, 1000);
        }
        return newVal;
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 gap-6 overflow-y-auto pb-32 custom-scrollbar">
       
       {/* Forest Stage */}
       <div className="relative w-full max-w-xl bg-[#E8F5E9] rounded-[2rem] p-8 shadow-inner border-4 border-[#A5D6A7] flex flex-col items-center gap-8 mt-4 overflow-hidden shrink-0">
          
          {/* Background Trees */}
          <div className="absolute bottom-0 left-0 opacity-20 pointer-events-none text-green-800">
             <Trees size={120} />
          </div>
          <div className="absolute bottom-0 right-[-20px] opacity-20 pointer-events-none text-green-800 transform scale-x-[-1]">
             <Trees size={140} />
          </div>

          {/* Title Board */}
          <div className="bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-green-100 backdrop-blur-sm z-10">
              <h3 className="font-bold text-green-800 flex items-center gap-2">
                  {isBugMode ? '🔴 健忘的计数器 (Buggy Counter)' : '🟢 记忆计数器 (Remembered)'}
              </h3>
          </div>

          {/* The Basket (Counter Display) */}
          <div className="relative group">
             <div className="w-40 h-40 bg-[#8D6E63] rounded-b-[3rem] rounded-t-lg shadow-xl flex items-center justify-center border-b-8 border-[#6D4C41] relative z-10">
                 <span className="text-6xl font-black text-white drop-shadow-md font-mono">
                     {isBugMode ? bugCount : fixedCount}
                 </span>
             </div>
             {/* Handle */}
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-24 border-8 border-[#6D4C41] rounded-t-full -z-0"></div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center gap-2 z-20">
              <button
                onClick={isBugMode ? handleBugClick : handleFixClick}
                className={`
                    relative px-8 py-4 rounded-full font-bold text-lg shadow-lg transform active:scale-95 transition-all flex items-center gap-2
                    ${isBugMode 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                    }
                `}
              >
                 <Plus size={24} strokeWidth={3} />
                 {isBugMode ? '捡起松果 (Pick)' : '捡起松果 (Remember)'}
              </button>
              
              {/* Hint when user gets stuck in bug mode */}
              {isBugMode && attempts >= 3 && (
                 <div className="text-xs text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-full animate-bounce">
                     坏掉啦！请点击对话框的“Next”继续 👉
                 </div>
              )}
          </div>

          {isBugMode && (
              <div className="absolute top-1/2 right-4 w-24 text-xs text-red-500 font-bold bg-white/90 p-2 rounded-lg shadow animate-pulse border border-red-200">
                  ⚠️ Count 重置为 0!
              </div>
          )}
       </div>

       {/* Code Board */}
       <div className={`w-full max-w-xl rounded-2xl border-l-8 p-5 shadow-md flex gap-4 transition-all shrink-0
           ${isBugMode ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-500'}
       `}>
           <div className="shrink-0 pt-1">
               {isBugMode ? <AlertCircle className="text-red-400" /> : <CheckCircle2 className="text-green-600" />}
           </div>
           <div className="flex-1">
               <h4 className={`font-bold text-lg mb-1 ${isBugMode ? 'text-red-800' : 'text-green-800'}`}>
                   {isBugMode ? "为什么永远是 0？" : "成功！它记住了！"}
               </h4>
               <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                   {isBugMode 
                     ? "因为变量 `count` 定义在函数内部。每次界面刷新（Recomposition），函数重新运行，`var count = 0` 这行代码就无情地把计数器归零了。"
                     : "使用了 `remember` 后，Compose 运行时会把这个值保存在特殊的内存区域。即使函数重新运行，它也会直接读取上次保存的值，而不是重新初始化。"
                   }
               </p>
               <div className="bg-slate-800 rounded-lg p-3 overflow-x-auto relative">
                   <pre className="font-mono text-xs text-blue-200 whitespace-pre-wrap">
                       {isBugMode 
                        ? `fun PineconeCounter() {\n  var count = 0 // ❌ 每次都重置\n  Button(onClick = { count++ }) ...\n}` 
                        : `fun PineconeCounter() {\n  // ✅ 数据持久化\n  var count by remember { mutableStateOf(0) }\n  Button(onClick = { count++ }) ...\n}`
                       }
                   </pre>
               </div>
           </div>
       </div>

    </div>
  );
};

export default InteractiveRememberLab;