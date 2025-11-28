
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Camera, RefreshCw, ShoppingBasket, Backpack, AlertCircle, CheckCircle2, HelpCircle, Code2, Play, Edit3, Terminal, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveConfigLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;
  
  // === LAB 1: PHOTO & FIX STATES ===
  const [isRotated, setIsRotated] = useState(false);
  const [basketCount, setBasketCount] = useState(0); 
  const [backpackCount, setBackpackCount] = useState(0); 
  const [hasRotatedOnce, setHasRotatedOnce] = useState(false);

  // === LAB 2: QUIZ STATE ===
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // === LAB 3: GUIDED TYPING STATE ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 4: AI ASSIGNMENT STATE ===
  const [userCode, setUserCode] = useState("val isChecked by remember {\n  mutableStateOf(false)\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: ROTATION LAB ---
  const handleRotate = () => {
    setIsRotated(prev => !prev);
    setHasRotatedOnce(true);
    setBasketCount(0); // Crisis mode
    if (mode === 'PHOTO_CRISIS') {
        setTimeout(onComplete, 2500);
    }
  };
  useEffect(() => {
      if (mode === 'BACKPACK_FIX' && hasRotatedOnce && backpackCount > 0) {
          const timer = setTimeout(onComplete, 2000);
          return () => clearTimeout(timer);
      }
  }, [mode, hasRotatedOnce, backpackCount, onComplete]);


  // --- LOGIC: QUIZ ---
  const handleQuizAnswer = (answer: string) => {
      setQuizAnswer(answer);
      if (answer === 'Socket') {
          setTimeout(onComplete, 1500);
      }
  };


  // --- LOGIC: CODE CHALLENGE (CHOICE) ---
  const handleCodeChoice = (isCorrect: boolean) => {
      if (isCorrect) setTimeout(onComplete, 1000);
      else alert("不对哦，remember 还是会丢失数据。");
  };


  // --- LOGIC: GUIDED TYPING ---
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setTypedCode(input);
      // Normalize spaces for comparison
      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
      if (config.targetCode && normalize(input) === normalize(config.targetCode)) {
          setIsTypedCorrect(true);
          setTimeout(onComplete, 1500);
      }
  };


  // --- LOGIC: AI ASSIGNMENT ---
  const checkCodeWithAI = async () => {
      setAiLoading(true);
      setAiFeedback(null);
      
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `
                You are Rin Shima from Yuru Camp, a strict but helpful coding mentor.
                The user is writing Jetpack Compose code. 
                Task: "${config.assignmentPrompt}".
                User Code: "${userCode}".
                
                Check if the code correctly uses 'rememberSaveable' and 'mutableStateOf' to solve the rotation data loss issue.
                Respond with a JSON object ONLY: { "pass": boolean, "message": "string (in character as Rin, Simplified Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          
          if (result.pass) {
              setTimeout(onComplete, 3000);
          }
      } catch (error) {
          console.error("AI Error", error);
          setAiFeedback({ pass: false, msg: "AI 连接失败（可能是 Key 配置问题），但我相信你！(模拟通过)" });
          setTimeout(onComplete, 2000);
      } finally {
          setAiLoading(false);
      }
  };


  // ---------------- RENDER ----------------

  // 1. GUIDED TYPING
  if (mode === 'GUIDED_TYPING') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <div className="bg-[#FFFDF5] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 relative overflow-hidden">
                  {/* Notebook Holes */}
                  <div className="absolute left-4 top-0 bottom-0 w-8 border-r-2 border-red-200 flex flex-col justify-evenly">
                      {[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 rounded-full bg-slate-100 shadow-inner"></div>)}
                  </div>
                  
                  <div className="ml-12">
                      <h3 className="text-xl font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Edit3 size={24} className="text-green-600" /> 
                          露营笔记：手抄加深记忆
                      </h3>
                      <p className="text-slate-500 mb-6 text-sm">请在横线上准确输入下方的代码：</p>
                      
                      <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 mb-4 font-mono text-sm text-slate-600 select-none opacity-80">
                          {config.targetCode}
                      </div>

                      <div className="relative">
                          <input 
                            type="text" 
                            value={typedCode}
                            onChange={handleTyping}
                            className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                                ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-slate-300 text-slate-800 focus:border-blue-500'}
                            `}
                            placeholder="// 在此输入代码..."
                            autoFocus
                          />
                          {isTypedCorrect && <CheckCircle2 className="absolute right-2 top-2 text-green-500 animate-bounce" />}
                      </div>
                      
                      {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">记忆同步完成！</p>}
                  </div>
              </div>
          </div>
      );
  }

  // 2. OPEN ASSIGNMENT (AI)
  if (mode === 'OPEN_ASSIGNMENT') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
              <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-slate-700">
                  {/* IDE Header */}
                  <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-700">
                      <div className="flex items-center gap-2 text-slate-300">
                          <Terminal size={18} />
                          <span className="font-mono text-sm font-bold">Rin's Proving Ground</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500"></span>
                          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                          <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      </div>
                  </div>

                  {/* Prompt */}
                  <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                      <p className="text-blue-200 text-sm font-mono leading-relaxed">
                          <span className="text-green-400">#</span> {config.assignmentPrompt}
                      </p>
                  </div>

                  {/* Code Area */}
                  <textarea 
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="flex-1 bg-[#1e293b] text-slate-100 font-mono text-sm p-4 outline-none resize-none"
                      spellCheck={false}
                  />

                  {/* Footer / Actions */}
                  <div className="bg-[#0f172a] p-4 flex items-center justify-between border-t border-slate-700">
                      <div className="flex-1 mr-4">
                          {aiFeedback && (
                              <div className={`text-xs font-mono p-2 rounded border ${aiFeedback.pass ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
                                  {aiFeedback.pass ? '凛: ' : '凛: '} {aiFeedback.msg}
                              </div>
                          )}
                      </div>
                      <button 
                        onClick={checkCodeWithAI}
                        disabled={aiLoading || (aiFeedback?.pass)}
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all
                            ${aiLoading ? 'bg-slate-600 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white'}
                        `}
                      >
                          {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                          {aiLoading ? "凛正在Code Review..." : "提交审核"}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // 3. QUIZ
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

// 4. CODE CHALLENGE (CHOICE)
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

  // 5. PHOTO CRISIS & FIX (VISUAL LAB)
  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 gap-6 overflow-y-auto pb-32 custom-scrollbar">
       
       <div className="bg-white/80 backdrop-blur text-green-800 px-6 py-2 rounded-full font-bold text-sm shadow-sm border border-green-200 flex items-center gap-2 animate-fade-in">
           <Camera size={16} />
           {mode === 'PHOTO_CRISIS' 
             ? "任务：捡几个松果，然后旋转相机拍照" 
             : "任务：给背包(右侧)加松果，然后旋转验证"}
       </div>

       <div className={`
           relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
           ${isRotated ? 'w-[450px] h-[240px]' : 'w-[280px] h-[450px]'}
           bg-slate-800 rounded-3xl shadow-2xl border-8 border-slate-700 flex flex-col items-center justify-center overflow-hidden shrink-0
       `}>
           <div className="absolute inset-4 border-2 border-white/20 rounded-2xl pointer-events-none z-10">
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

           <div className="w-full h-full bg-gradient-to-b from-blue-200 to-green-100 relative p-6 flex flex-col items-center justify-center gap-4 transition-all duration-700">
               <div className="absolute bottom-0 w-full flex justify-between opacity-40 text-green-800 pointer-events-none">
                   <span className="text-6xl">🌲</span><span className="text-4xl">🌳</span><span className="text-7xl">🌲</span>
               </div>

               <div className={`flex gap-4 z-20 transition-all duration-700 ${isRotated ? 'flex-row items-end' : 'flex-col items-center'}`}>
                   
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

           <button 
             onClick={handleRotate}
             className="absolute bottom-4 z-30 bg-slate-900/80 text-white p-3 rounded-full hover:bg-slate-700 active:scale-95 transition-all border border-white/20"
           >
               <RefreshCw size={24} className={`transition-transform duration-500 ${isRotated ? 'rotate-90' : 'rotate-0'}`} />
           </button>
       </div>

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
