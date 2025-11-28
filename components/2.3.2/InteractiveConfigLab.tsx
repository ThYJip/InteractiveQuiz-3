import React, { useState } from 'react';
import { InteractiveState } from './types';
import { Smartphone, RefreshCw, Archive, AlertTriangle, CheckCircle2, Plus, HelpCircle } from 'lucide-react';

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveConfigLab: React.FC<Props> = ({ config, onComplete }) => {
  const [count, setCount] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [activityStatus, setActivityStatus] = useState<'ALIVE' | 'DESTROYED' | 'RECREATED'>('ALIVE');
  const [completed, setCompleted] = useState(false);

  const isProblemMode = config.mode === 'ROTATION_PROBLEM';

  const handleRotate = () => {
    // 1. Simulate Destroy
    setActivityStatus('DESTROYED');
    
    setTimeout(() => {
        // 2. Recreate
        setIsLandscape(prev => !prev);
        setActivityStatus('RECREATED');
        
        // LOGIC: Data Loss vs Persistence
        if (isProblemMode) {
            setCount(0); // Lost!
        } else {
            // Count preserved!
        }

        // Check for success condition
        if (count > 0) { // Only finish if we actually had some pinecones to test with
             if (isProblemMode) {
                 setCompleted(true);
                 setTimeout(onComplete, 2500); // Give user time to read the failure message
             } else {
                 setCompleted(true);
                 setTimeout(onComplete, 2500);
             }
        }
    }, 800);
  };

  const handleAdd = () => {
      setCount(prev => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 gap-6 overflow-y-auto pb-32 custom-scrollbar">
       
       {/* Instruction Banner */}
       <div className={`px-6 py-2 rounded-full font-bold text-sm shadow-sm flex items-center gap-2 ${completed ? 'bg-green-100 text-green-700' : 'bg-white text-slate-600'}`}>
           {!completed && (
               <>
                 <span className="bg-slate-200 px-2 rounded text-slate-800">1</span> 添加松果
                 <span className="text-slate-300">→</span>
                 <span className="bg-slate-200 px-2 rounded text-slate-800">2</span> 旋转屏幕
               </>
           )}
           {completed && <span>测试完成！继续剧情 👉</span>}
       </div>

       {/* Phone Simulator */}
       <div className={`relative transition-all duration-700 ease-in-out shrink-0
           ${isLandscape ? 'w-[400px] h-[200px]' : 'w-[220px] h-[400px]'}
       `}>
           {/* Phone Frame */}
           <div className={`
                w-full h-full bg-slate-800 rounded-[2rem] border-[8px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col
                ${activityStatus === 'DESTROYED' ? 'scale-90 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'}
                transition-all duration-500
           `}>
               {/* Status Bar */}
               <div className="w-full h-6 bg-slate-900 flex justify-between items-center px-4">
                   <div className="text-[8px] text-white">12:00</div>
                   <div className="flex gap-1">
                       <div className="w-2 h-2 bg-white rounded-full"></div>
                       <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                   </div>
               </div>

               {/* App Content */}
               <div className="flex-1 bg-[#E0F2F1] relative flex flex-col items-center justify-center p-4">
                   
                   {/* Android Activity Label */}
                   <div className="absolute top-2 left-2 text-[8px] font-mono text-teal-800/50 bg-teal-100 px-1 rounded">
                       MainActivity.kt
                   </div>

                   <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2">
                       🌲 Pinecone Tracker
                   </h3>

                   <div className="text-5xl font-black text-teal-700 mb-6 drop-shadow-sm">
                       {count}
                   </div>

                   <button 
                     onClick={handleAdd}
                     className="bg-teal-600 hover:bg-teal-500 active:scale-95 text-white p-4 rounded-full shadow-lg transition-transform"
                   >
                       <Plus size={24} />
                   </button>
               </div>
           </div>

           {/* Rotate Action Button (Outside Phone) */}
           <button 
             onClick={handleRotate}
             className="absolute -right-20 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border-2 border-slate-100 text-slate-600 hover:text-teal-600 hover:rotate-180 transition-all duration-500 z-20 group"
             title="Rotate Screen"
           >
               <RefreshCw size={24} />
               <span className="absolute left-full ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                   旋转屏幕
               </span>
           </button>
       </div>

       {/* System Log / Feedback */}
       <div className={`w-full max-w-xl rounded-2xl border-l-8 p-5 shadow-md flex flex-col gap-4 transition-all shrink-0
           ${activityStatus === 'RECREATED' 
                ? (isProblemMode && count === 0 ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-500')
                : 'bg-white border-slate-200'
           }
       `}>
           <div className="flex gap-4">
               <div className="shrink-0 pt-1">
                   {activityStatus === 'RECREATED' 
                      ? (isProblemMode && count === 0 ? <AlertTriangle className="text-red-400" /> : <CheckCircle2 className="text-green-600" />)
                      : <Smartphone className="text-slate-400" />
                   }
               </div>
               
               <div className="flex-1">
                   <h4 className="font-bold text-slate-800 mb-1">
                       System Status: {activityStatus}
                   </h4>
                   
                   {activityStatus === 'RECREATED' && (
                       <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <p className={`text-sm mb-2 font-medium ${isProblemMode && count === 0 ? 'text-red-600' : 'text-green-600'}`}>
                               {isProblemMode && count === 0 
                                    ? "Activity 重建！内存中的 `remember` 丢失！Count 归零。"
                                    : "Activity 重建！从 `SavedStateHandle` 恢复数据！Count 保持不变。"
                               }
                           </p>
                           {!isProblemMode && (
                               <div className="flex items-center gap-2 text-xs bg-green-100 text-green-800 px-3 py-2 rounded-lg border border-green-200">
                                   <Archive size={14} />
                                   <span>Bundle Restored: {`{ "count": ${count} }`}</span>
                               </div>
                           )}
                       </div>
                   )}

                   {activityStatus === 'ALIVE' && (
                       <p className="text-slate-500 text-sm">
                           Activity 运行正常。数据暂时存储在 RAM 中。
                       </p>
                   )}
               </div>
           </div>
           
           {/* BEGINNER EXPLANATION CARD */}
           {activityStatus === 'RECREATED' && (
                <div className="mt-1 bg-white/60 p-3 rounded-xl border border-slate-200/50 text-xs md:text-sm text-slate-700 leading-relaxed animate-in fade-in duration-700">
                    <h5 className="font-bold flex items-center gap-1 mb-1 text-slate-800">
                        <HelpCircle size={14} className="text-teal-600"/> 
                        🔰 它是怎么工作的？
                    </h5>
                    {isProblemMode ? (
                        <span>
                            想象 <code>remember</code> 就像<b>金鱼的记忆</b> 🐟。数据存在运行内存 (RAM) 里。
                            当屏幕旋转时，旧的“手机”(Activity) 被系统销毁（就像断电一样），内存被清空，所以数据就丢了。
                        </span>
                    ) : (
                        <span>
                            想象 <code>rememberSaveable</code> 就像一个<b>坚固的保险箱</b> 🔐。
                            它会自动把数据打包存进系统的硬盘 (Bundle) 里。
                            即使旧的“手机”被销毁，新创建的“手机”会立刻收到这个保险箱，数据完好无损！
                        </span>
                    )}
                </div>
           )}
       </div>

    </div>
  );
};

export default InteractiveConfigLab;