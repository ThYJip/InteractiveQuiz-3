import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Lightbulb, Info, CheckCircle2, AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveHoistingLab: React.FC<Props> = ({ config, onComplete }) => {
  // === PROBLEM MODE STATE (Independent) ===
  const [valA, setValA] = useState(0.2);
  const [valB, setValB] = useState(0.8);

  // === SOLUTION MODE STATE (Hoisted) ===
  const [sharedVal, setSharedVal] = useState(0.5);

  const isProblemMode = config.mode === 'STATEFUL_PROBLEM';

  // Check for completion in solution mode
  useEffect(() => {
    if (!isProblemMode) {
       // Simple completion trigger: user interacted with it
       // In a real game, maybe match a target brightness?
       // Let's just give them 5 seconds of playing around or if they hit > 0.8
       if (sharedVal > 0.8 || sharedVal < 0.2) {
           setTimeout(onComplete, 1500);
       }
    } else {
        // In problem mode, let them play for a bit then finish
        // Or wait for them to mismatch drastically
        if (Math.abs(valA - valB) > 0.5) {
            setTimeout(onComplete, 3000);
        }
    }
  }, [sharedVal, valA, valB, isProblemMode, onComplete]);

  // Code Feedback Text
  const getFeedback = () => {
    if (isProblemMode) {
        return {
            title: "糟糕！状态不同步",
            desc: "每个滑块都有自己的 `state`。左边是 20%，右边是 80%，提灯到底该听谁的？它甚至不知道该显示多亮！",
            code: `// Slider A (内部状态)
var level by remember { mutableStateOf(0.2f) }

// Slider B (内部状态 - 另一份副本！)
var level by remember { mutableStateOf(0.8f) }`,
            type: 'bad'
        };
    } else {
        return {
            title: "完美！单向数据流",
            desc: "父组件持有 `sharedVal`。当任一滑块滑动时，事件上报给父组件，父组件更新状态，然后新的值同时流向两个滑块。",
            code: `// Parent (控制塔)
var sharedVal by remember { mutableStateOf(${sharedVal.toFixed(2)}f) }

// Sliders (无状态 - 仅仅是渲染)
StatelessSlider(value = sharedVal, onValueChange = { sharedVal = it })`,
            type: 'good'
        };
    }
  };

  const feedback = getFeedback();

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 gap-4">
       
       {/* Main Stage: The Lantern */}
       <div className="relative w-full max-w-2xl bg-camp-bg rounded-3xl p-8 shadow-inner border-2 border-orange-100 flex flex-col items-center gap-8 mt-4">
          
          {/* The Shared Lantern */}
          <div className="relative group transition-all duration-500">
             <Lightbulb 
                size={120} 
                className={`transition-all duration-300 ${isProblemMode ? 'text-slate-400 animate-pulse' : 'text-yellow-500'}`}
                style={{ 
                    filter: isProblemMode 
                        ? 'drop-shadow(0 0 5px rgba(0,0,0,0.2))' 
                        : `drop-shadow(0 0 ${sharedVal * 60}px rgba(234, 179, 8, ${sharedVal}))`,
                    opacity: isProblemMode ? 0.5 : Math.max(0.2, sharedVal) 
                }}
             />
             {isProblemMode && (
                 <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                     ???
                 </div>
             )}
          </div>

          <div className="w-full flex items-center justify-between gap-8 px-4 md:px-12">
              {/* Slider A */}
              <div className="flex flex-col items-center gap-2 w-1/2">
                  <span className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider">Controller A</span>
                  <div className={`p-4 rounded-2xl w-full border-2 transition-all ${isProblemMode ? 'bg-white border-red-100' : 'bg-green-50 border-green-200'}`}>
                      <input 
                        type="range" min="0" max="1" step="0.01"
                        value={isProblemMode ? valA : sharedVal}
                        onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            if (isProblemMode) setValA(v);
                            else setSharedVal(v);
                        }}
                        className="w-full accent-camp-rin cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                      />
                      <div className="text-center mt-2 font-mono text-sm text-slate-600">
                          {(isProblemMode ? valA : sharedVal).toFixed(2)}
                      </div>
                  </div>
              </div>

              {/* Slider B */}
              <div className="flex flex-col items-center gap-2 w-1/2">
                  <span className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider">Controller B</span>
                  <div className={`p-4 rounded-2xl w-full border-2 transition-all ${isProblemMode ? 'bg-white border-red-100' : 'bg-green-50 border-green-200'}`}>
                      <input 
                        type="range" min="0" max="1" step="0.01"
                        value={isProblemMode ? valB : sharedVal}
                        onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            if (isProblemMode) setValB(v);
                            else setSharedVal(v);
                        }}
                        className="w-full accent-camp-nadeshiko cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                      />
                       <div className="text-center mt-2 font-mono text-sm text-slate-600">
                          {(isProblemMode ? valB : sharedVal).toFixed(2)}
                      </div>
                  </div>
              </div>
          </div>
       </div>

       {/* Feedback Panel */}
       <div className={`w-full max-w-3xl mt-2 rounded-2xl border-l-8 p-5 shadow-lg flex gap-4 transition-all
           ${feedback.type === 'bad' ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'}
       `}>
           <div className="shrink-0 pt-1">
               {feedback.type === 'bad' ? <AlertTriangle className="text-red-400" /> : <CheckCircle2 className="text-green-500" />}
           </div>
           <div className="flex-1">
               <h4 className={`font-bold text-lg mb-1 ${feedback.type === 'bad' ? 'text-red-700' : 'text-green-700'}`}>
                   {feedback.title}
               </h4>
               <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                   {feedback.desc}
               </p>
               <div className="bg-slate-800 rounded-lg p-3 overflow-x-auto relative group">
                   <div className="absolute top-2 right-2 text-[10px] text-slate-500 font-mono">KOTLIN</div>
                   <pre className="font-mono text-xs text-blue-200 whitespace-pre-wrap">{feedback.code}</pre>
               </div>
           </div>
       </div>

    </div>
  );
};

export default InteractiveHoistingLab;