
import React, { useState } from 'react';
import { InteractiveState } from './types';
import { Camera, RefreshCw, ShoppingBasket, Backpack, AlertCircle, CheckCircle2, HelpCircle, Code2, Play } from 'lucide-react';

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveConfigLab: React.FC<Props> = ({ config, onComplete }) => {
  const [isRotated, setIsRotated] = useState(false);
  const [basketCount, setBasketCount] = useState(0); 
  const [backpackCount, setBackpackCount] = useState(0); 
  const [hasRotatedOnce, setHasRotatedOnce] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const mode = config.mode;

  // === LAB 1: PHOTO CRISIS & FIX ===
  const handleRotate = () => {
    setIsRotated(prev => !prev);
    setHasRotatedOnce(true);

    // Simulation: remember loses data
    setBasketCount(0); 
    
    // Simulation: rememberSaveable keeps data (backpackCount stays)

    if (mode === 'BACKPACK_FIX') {
        if (backpackCount > 0) setTimeout(onComplete, 2000);
    } else if (mode === 'PHOTO_CRISIS') {
        setTimeout(onComplete, 2500);
    }
  };

  // === LAB 2: QUIZ ===
  const handleQuizAnswer = (answer: string) => {
      setQuizAnswer(answer);
      if (answer === 'Socket') {
          setTimeout(onComplete, 1500);
      }
  };

  // === LAB 3: CODE CHALLENGE ===
  const handleCodeChoice = (isCorrect: boolean) => {
      if (isCorrect) {
          setTimeout(onComplete, 1000);
      } else {
          alert("不对哦，remember 还是会丢失数据。请选择带 'Saveable' 的版本！");
      }
  };

  // ---------------- RENDER QUIZ ----------------
  if (mode === 'QUIZ') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-green-100 max-w-lg w-full">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-100 p-2 rounded-full"><HelpCircle className="text-green-600" /></div>
                      <h3 className="text-xl font-bold text-green-900">前辈的提问</h3>
                  </div>
                  <p className="text-lg text-slate-700 font-medium mb-6">
                      以下哪个对象 <span className="text-red-500 font-bold">不能</span> 被 `rememberSaveable` 自动保存到 Bundle 中？
                  </p>
                  <div className="space-y-3">
                      {['Int (整数)', 'String (字符串)', 'Socket (网络连接)'].map((opt) => {
                          const val = opt.split(' ')[0];
                          const isSelected = quizAnswer === val;
                          const isCorrect = val === 'Socket';
                          
                          let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                          if (isSelected) {
                              btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                          } else {
                              btnClass += "bg-white border-slate-200 hover:border-green-400 hover:bg-green-50 text-slate-700";
                          }

                          return (
                              <button key={val} onClick={() => handleQuizAnswer(val)} className={btnClass} disabled={!!quizAnswer}>
                                  {opt}
                              </button>
                          )
                      })}
                  </div>
                  {quizAnswer === 'Socket' && (
                      <div className="mt-4 text-green-600 font-bold animate-bounce text-center">✅ 回答正确！</div>
                  )}
                  {quizAnswer && quizAnswer !== 'Socket' && (
                      <div className="mt-4 text-red-500 font-bold text-center">❌ 哎呀，Bundle 可以存基本类型的。再想想？</div>
                  )}
              </div>
          </div>
      )
  }

  // ---------------- RENDER CODE CHALLENGE ----------------
  if (mode === 'CODE_CHALLENGE') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
            <div className="bg-white/60 px-6 py-2 rounded-full font-bold text-green-900 border border-green-200">
                请点击正确的代码块来修复 Bug
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
                {/* Wrong Option */}
                <button onClick={() => handleCodeChoice(false)} className="group relative bg-[#1e293b] p-6 rounded-2xl text-left border-4 border-transparent hover:border-red-400 transition-all shadow-xl">
                    <div className="absolute -top-3 -left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow hidden group-hover:block">WRONG</div>
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Code2 size={20} />
                        <span className="font-mono text-sm">Option A</span>
                    </div>
                    <pre className="font-mono text-sm text-blue-300">
                        val count by remember {'{\n'}  mutableStateOf(0) {'\n}'}
                    </pre>
                </button>

                {/* Correct Option */}
                <button onClick={() => handleCodeChoice(true)} className="group relative bg-[#1e293b] p-6 rounded-2xl text-left border-4 border-transparent hover:border-green-400 transition-all shadow-xl">
                     <div className="absolute -top-3 -left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow hidden group-hover:block">CORRECT</div>
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Code2 size={20} />
                        <span className="font-mono text-sm">Option B</span>
                    </div>
                    <pre className="font-mono text-sm text-green-300">
                        val count by rememberSaveable {'{\n'}  mutableStateOf(0) {'\n}'}
                    </pre>
                </button>
            </div>
        </div>
      )
  }

  // ---------------- RENDER SIMULATION (CRISIS & FIX) ----------------
  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 gap-6 overflow-y-auto pb-32 custom-scrollbar">
       
       {/* Instruction */}
       <div className="bg-white/80 backdrop-blur text-green-800 px-6 py-2 rounded-full font-bold text-sm shadow-sm border border-green-200 flex items-center gap-2 animate-fade-in">
           <Camera size={16} />
           {mode === 'PHOTO_CRISIS' 
             ? "任务：捡几个松果，然后旋转相机拍照" 
             : "任务：给背包(右侧)加松果，然后旋转验证"}
       </div>

       {/* Camera Viewfinder */}
       <div className={`
           relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
           ${isRotated ? 'w-[450px] h-[240px]' : 'w-[280px] h-[450px]'}
           bg-slate-800 rounded-3xl shadow-2xl border-8 border-slate-700 flex flex-col items-center justify-center overflow-hidden shrink-0
       `}>
           <div className="absolute inset-4 border-2 border-white/20 rounded-2xl pointer-events-none z-10">
               {/* Viewfinder UI Elements */}
               <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
               <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
               <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
               <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
               {hasRotatedOnce && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white font-bold px-4 py-2 rounded-xl backdrop-blur-md animate-ping-once text-center text-xs">
                       ACTIVITY<br/>RECREATED
                   </div>
               )}
           </div>

           {/* Scene */}
           <div className="w-full h-full bg-gradient-to-b from-blue-200 to-green-100 relative p-6 flex flex-col items-center justify-center gap-4 transition-all duration-700">
               {/* Trees */}
               <div className="absolute bottom-0 w-full flex justify-between opacity-40 text-green-800 pointer-events-none">
                   <span className="text-6xl">🌲</span><span className="text-4xl">🌳</span><span className="text-7xl">🌲</span>
               </div>

               <div className={`flex gap-4 z-20 transition-all duration-700 ${isRotated ? 'flex-row items-end' : 'flex-col items-center'}`}>
                   
                   {/* Remember Item (Basket) */}
                   <div className="flex flex-col items-center gap-2">
                       <div className="relative group">
                           <button 
                             onClick={() => setBasketCount(c => c + 1)}
                             className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-lg active:scale-90 transition-transform hover:bg-amber-50"
                           >
                               <ShoppingBasket size={32} className="text-amber-700" />
                               {basketCount > 0 && (
                                   <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                                       {basketCount}
                                   </span>
                               )}
                           </button>
                           <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded text-slate-500 font-mono mt-1 block text-center">remember</span>
                       </div>
                   </div>

                   {/* RememberSaveable Item (Backpack) - Only in Fix Mode */}
                   {mode === 'BACKPACK_FIX' && (
                       <div className="flex flex-col items-center gap-2">
                           <div className="relative group">
                               <button 
                                 onClick={() => setBackpackCount(c => c + 1)}
                                 className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-300 shadow-lg active:scale-90 transition-transform hover:bg-blue-50"
                               >
                                   <Backpack size={32} className="text-blue-700" />
                                   {backpackCount > 0 && (
                                       <span className="absolute -top-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                                           {backpackCount}
                                       </span>
                                   )}
                               </button>
                               <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded text-slate-500 font-mono mt-1 block text-center">saveable</span>
                           </div>
                           {hasRotatedOnce && backpackCount > 0 && (
                               <span className="text-xs text-green-600 font-bold bg-white/80 px-2 rounded animate-pulse">Saved!</span>
                           )}
                       </div>
                   )}
               </div>
           </div>

           {/* Rotate Trigger */}
           <button 
             onClick={handleRotate}
             className="absolute bottom-4 z-30 bg-slate-900/80 text-white p-3 rounded-full hover:bg-slate-700 active:scale-95 transition-all border border-white/20"
           >
               <RefreshCw size={24} className={`transition-transform duration-500 ${isRotated ? 'rotate-90' : 'rotate-0'}`} />
           </button>
       </div>

       {/* Feedback */}
       {hasRotatedOnce && (
           <div className={`w-full max-w-xl rounded-2xl p-4 shadow-lg flex gap-3 transition-all shrink-0 animate-slide-up
               ${mode === 'PHOTO_CRISIS' ? 'bg-red-50 border-l-4 border-red-400' : 'bg-green-50 border-l-4 border-green-500'}
           `}>
               <div className="shrink-0 pt-1">
                   {mode === 'PHOTO_CRISIS' ? <AlertCircle className="text-red-500" size={20} /> : <CheckCircle2 className="text-green-600" size={20} />}
               </div>
               <div>
                   <h4 className={`font-bold text-sm mb-1 ${mode === 'PHOTO_CRISIS' ? 'text-red-800' : 'text-green-800'}`}>
                       {mode === 'PHOTO_CRISIS' ? "Basket Emptied!" : "Backpack Secure!"}
                   </h4>
                   <p className="text-slate-600 text-xs leading-relaxed">
                       {mode === 'PHOTO_CRISIS' 
                         ? "普通的 `remember` 无法在 Activity 销毁重建（如屏幕旋转）时保留数据。"
                         : "`rememberSaveable` 将数据序列化存入了 Bundle，成功跨越了“世界毁灭”！"
                       }
                   </p>
               </div>
           </div>
       )}

    </div>
  );
};

export default InteractiveConfigLab;
