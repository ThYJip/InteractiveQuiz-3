
import React, { useState } from 'react';
import { InteractiveState } from './types';
import { Camera, RefreshCw, ShoppingBasket, Backpack, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveConfigLab: React.FC<Props> = ({ config, onComplete }) => {
  const [isRotated, setIsRotated] = useState(false);
  const [basketCount, setBasketCount] = useState(0); // Represents remember
  const [backpackCount, setBackpackCount] = useState(0); // Represents rememberSaveable
  const [hasRotatedOnce, setHasRotatedOnce] = useState(false);

  const isCrisisMode = config.mode === 'PHOTO_CRISIS';

  const handleRotate = () => {
    setIsRotated(prev => !prev);
    setHasRotatedOnce(true);

    // SIMULATION LOGIC:
    // When rotated (Activity Recreated), "Basket" (remember) loses data.
    setBasketCount(0); 
    
    // "Backpack" (rememberSaveable) keeps data.
    // (backpackCount stays same)

    if (!isCrisisMode) {
        // In Fix mode, if we rotated and backpack still has items, we win
        if (backpackCount > 0) {
            setTimeout(onComplete, 2500);
        }
    } else {
        // In Crisis mode, if we rotated and lost items, proceed to explanation
        setTimeout(onComplete, 2500);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 gap-6 overflow-y-auto pb-32 custom-scrollbar">
       
       {/* Instruction Pill */}
       <div className="bg-white/80 backdrop-blur text-green-800 px-6 py-2 rounded-full font-bold text-sm shadow-sm border border-green-200 flex items-center gap-2 animate-fade-in">
           <Camera size={16} />
           {isCrisisMode 
             ? "任务：捡几个松果，然后旋转相机拍照" 
             : "任务：对比测试！给两边都加松果，然后旋转"}
       </div>

       {/* Camera Viewfinder Simulator */}
       <div className={`
           relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
           ${isRotated ? 'w-[450px] h-[240px]' : 'w-[280px] h-[450px]'}
           bg-slate-800 rounded-3xl shadow-2xl border-8 border-slate-700 flex flex-col items-center justify-center overflow-hidden shrink-0
       `}>
           {/* Camera Lens UI Overlay */}
           <div className="absolute inset-4 border-2 border-white/20 rounded-2xl pointer-events-none z-10">
               <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
               <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
               <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
               <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-mono bg-black/20 px-2 rounded">
                   {isRotated ? 'LANDSCAPE 16:9' : 'PORTRAIT 9:16'}
               </div>
               {hasRotatedOnce && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white font-bold px-4 py-2 rounded-xl backdrop-blur-md animate-ping-once">
                       ACTIVITY RECREATED!
                   </div>
               )}
           </div>

           {/* Scene Content */}
           <div className="w-full h-full bg-gradient-to-b from-blue-200 to-green-100 relative p-6 flex flex-col items-center justify-center gap-4 transition-all duration-700">
               
               {/* Background Trees */}
               <div className="absolute bottom-0 w-full flex justify-between opacity-40 text-green-800 pointer-events-none">
                   <span className="text-6xl">🌲</span>
                   <span className="text-4xl">🌳</span>
                   <span className="text-7xl">🌲</span>
               </div>

               <div className={`flex gap-4 z-20 transition-all duration-700 ${isRotated ? 'flex-row items-end' : 'flex-col items-center'}`}>
                   
                   {/* Item 1: The Basket (Remember) */}
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
                           <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded text-slate-500 font-mono mt-1 block text-center">
                               remember
                           </span>
                       </div>
                       {hasRotatedOnce && basketCount === 0 && (
                           <span className="text-xs text-red-500 font-bold bg-white/80 px-2 rounded animate-bounce">
                               Dropped!
                           </span>
                       )}
                   </div>

                   {/* Item 2: The Backpack (RememberSaveable) - Only in Fix Mode */}
                   {!isCrisisMode && (
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
                               <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded text-slate-500 font-mono mt-1 block text-center">
                                   saveable
                               </span>
                           </div>
                           {hasRotatedOnce && backpackCount > 0 && (
                               <span className="text-xs text-green-600 font-bold bg-white/80 px-2 rounded animate-pulse">
                                   Saved!
                               </span>
                           )}
                       </div>
                   )}

               </div>
           </div>

           {/* Rotate Button */}
           <button 
             onClick={handleRotate}
             className="absolute bottom-4 z-30 bg-slate-900/80 text-white p-3 rounded-full hover:bg-slate-700 active:scale-95 transition-all border border-white/20"
             title="Rotate Screen"
           >
               <RefreshCw size={24} className={`transition-transform duration-500 ${isRotated ? 'rotate-90' : 'rotate-0'}`} />
           </button>
       </div>

       {/* Feedback Card */}
       {hasRotatedOnce && (
           <div className={`w-full max-w-xl rounded-2xl p-5 shadow-lg flex gap-4 transition-all shrink-0 animate-slide-up
               ${isCrisisMode ? 'bg-red-50 border-l-8 border-red-400' : 'bg-green-50 border-l-8 border-green-500'}
           `}>
               <div className="shrink-0 pt-1">
                   {isCrisisMode ? <AlertCircle className="text-red-500" /> : <CheckCircle2 className="text-green-600" />}
               </div>
               <div>
                   <h4 className={`font-bold text-lg mb-1 ${isCrisisMode ? 'text-red-800' : 'text-green-800'}`}>
                       {isCrisisMode ? "东西掉光了！" : "背包守护了数据！"}
                   </h4>
                   <p className="text-slate-600 text-sm leading-relaxed">
                       {isCrisisMode 
                         ? "Activity 销毁时，普通的 remember 内存被清空。就像敞口篮子翻到了一样。"
                         : "rememberSaveable 把数据存进了 Bundle (系统保险箱)。即使 Activity 重建，数据也安全地取回来了！"
                       }
                   </p>
               </div>
           </div>
       )}

    </div>
  );
};

export default InteractiveConfigLab;
