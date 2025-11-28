
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Package, Smartphone, Gauge, AlertTriangle, CheckCircle2, Maximize2, Minimize2, Edit3, Terminal, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveLazyLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1 & 2: CRISIS & SOLUTION ===
  const [scrollPos, setScrollPos] = useState(0);
  const [renderedCount, setRenderedCount] = useState(0);

  // === LAB 3: PADDING QUIZ ===
  const [quizChoice, setQuizChoice] = useState<'CONTENT' | 'MODIFIER' | null>(null);

  // === LAB 4: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 5: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("items(messages) { msg ->\n  MessageRow(msg)\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);

  
  // --- CRISIS SIMULATION ---
  useEffect(() => {
    if (mode === 'PACKING_CRISIS') {
        // Simulate loading all items at once
        const timer = setInterval(() => {
             setRenderedCount(prev => {
                 if (prev < 1000) return prev + 50;
                 return 1000;
             });
        }, 100);
        return () => clearInterval(timer);
    }
    if (mode === 'LAZY_SOLUTION') {
        // Simulate scrolling calculation
        // Visible items = ~10 based on viewport
        setRenderedCount(12); // Buffer
    }
  }, [mode]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollPos(e.currentTarget.scrollTop);
      if (mode === 'LAZY_SOLUTION') {
          // In real lazy column, rendered count stays constant even if we scroll
          setRenderedCount(12 + Math.random() * 2); // Slight fluctuation simulation
          
          if (e.currentTarget.scrollTop > 300) {
              setTimeout(onComplete, 1500);
          }
      }
  };

  const handleCrisisComplete = () => {
     if (renderedCount >= 1000) onComplete();
  }


  // --- PADDING QUIZ ---
  const handleQuiz = (choice: 'CONTENT' | 'MODIFIER') => {
      setQuizChoice(choice);
      if (choice === 'CONTENT') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      if (quizChoice === 'CONTENT') return { correct: true, text: "正确！contentPadding 会在容器内部添加内边距，允许内容滚动到边缘，不会被裁切。" };
      if (quizChoice === 'MODIFIER') return { correct: false, text: "错误。Modifier.padding 会导致滚动区域变小，内容滑到边缘时会被生硬地“切断”。" };
      return null;
  };

  // --- TYPING ---
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setTypedCode(input);
      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
      if (config.targetCode && normalize(input) === normalize(config.targetCode)) {
          setIsTypedCorrect(true);
          setTimeout(onComplete, 1500);
      }
  };

  // --- AI CHECK ---
  const checkCodeWithAI = async () => {
      setAiLoading(true);
      setAiFeedback(null);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `
                You are Rin Shima (Yuru Camp). Task: ${config.assignmentPrompt}.
                User Code: "${userCode}".
                Check if 'key' parameter is used correctly in 'items' or 'itemsIndexed'.
                Respond JSON: { "pass": boolean, "message": "string (Rin's persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          console.error(error);
          setAiFeedback({ pass: false, msg: "AI 信号不好，这次算你过！(模拟通过)" });
          setTimeout(onComplete, 2000);
      } finally {
          setAiLoading(false);
      }
  };

  // === RENDERERS ===

  if (mode === 'GUIDED_TYPING') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-[#FFF8E1] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-amber-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：DSL 语法
                    </h3>
                    <div className="bg-amber-100 p-4 rounded-lg border border-amber-300 mb-4 font-mono text-sm text-amber-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-amber-300 text-amber-900 focus:border-amber-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Syntax Learned!</p>}
                </div>
            </div>
        </div>
      );
  }

  if (mode === 'AI_ASSIGNMENT') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
              <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-slate-700">
                  <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-700">
                      <div className="flex items-center gap-2 text-slate-300 font-mono text-sm font-bold">
                          <Terminal size={18} /> Rin's Proving Ground
                      </div>
                  </div>
                  <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                      <p className="text-blue-200 text-sm font-mono"><span className="text-green-400">#</span> {config.assignmentPrompt}</p>
                  </div>
                  <textarea 
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="flex-1 bg-[#1e293b] text-slate-100 font-mono text-sm p-4 outline-none resize-none"
                      spellCheck={false}
                  />
                  <div className="bg-[#0f172a] p-4 flex items-center justify-between border-t border-slate-700">
                       <div className="flex-1 mr-4">
                          {aiFeedback && (
                              <div className={`text-xs font-mono p-2 rounded border ${aiFeedback.pass ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
                                  {aiFeedback.msg}
                              </div>
                          )}
                      </div>
                      <button onClick={checkCodeWithAI} disabled={aiLoading || aiFeedback?.pass} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-500">
                          {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} 提交
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'PADDING_QUIZ') {
      const feedback = getQuizFeedback();
      const isSolved = quizChoice === 'CONTENT';

      return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
              <div className="bg-white/80 px-6 py-2 rounded-full font-bold text-amber-900 border border-amber-200 shadow-sm">
                  🤔 哪种方式能正确实现“内容内边距”，且不裁切滚动内容？
              </div>
              <div className="flex gap-8">
                  {/* Option A: Modifier */}
                  <button disabled={isSolved} onClick={() => handleQuiz('MODIFIER')} className={`group relative w-64 bg-slate-100 rounded-[2rem] border-8 border-slate-800 overflow-hidden shadow-xl transition-all ${quizChoice === 'MODIFIER' ? 'ring-4 ring-red-500 scale-95' : 'hover:scale-105'}`}>
                      <div className="absolute top-0 left-0 right-0 h-6 bg-slate-800 z-20 flex justify-center"><div className="w-20 h-4 bg-black rounded-b-xl"></div></div>
                      <div className="pt-8 px-4 h-full bg-white flex flex-col gap-2">
                          <div className="text-center text-xs text-red-500 font-bold mb-1">Modifier.padding()</div>
                          {/* Visualizing clipped content */}
                          <div className="border-2 border-dashed border-red-300 p-2 h-full overflow-hidden relative">
                              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-amber-100 rounded mb-2 w-full shrink-0"></div>)}
                              {/* The Fade indicating Clip */}
                              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent"></div>
                          </div>
                      </div>
                      {quizChoice === 'MODIFIER' && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center text-red-600 font-black text-4xl">X</div>}
                  </button>

                  {/* Option B: ContentPadding */}
                  <button disabled={isSolved} onClick={() => handleQuiz('CONTENT')} className={`group relative w-64 bg-slate-100 rounded-[2rem] border-8 border-slate-800 overflow-hidden shadow-xl transition-all ${quizChoice === 'CONTENT' ? 'ring-4 ring-green-500 scale-95' : 'hover:scale-105'}`}>
                      <div className="absolute top-0 left-0 right-0 h-6 bg-slate-800 z-20 flex justify-center"><div className="w-20 h-4 bg-black rounded-b-xl"></div></div>
                      <div className="pt-8 h-full bg-white flex flex-col">
                          <div className="text-center text-xs text-green-500 font-bold mb-1">contentPadding</div>
                          {/* Visualizing full scroll content */}
                          <div className="h-full overflow-hidden relative px-4">
                              <div className="absolute top-0 left-0 right-0 h-4 bg-transparent z-10 border-b border-green-200"></div> {/* Visual padding guide */}
                              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-green-100 rounded mb-2 w-full shrink-0 mt-2"></div>)}
                          </div>
                      </div>
                       {quizChoice === 'CONTENT' && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center text-green-600 font-black text-4xl">✓</div>}
                  </button>
              </div>
              {feedback && (
                  <div className={`mt-4 p-4 rounded-xl text-sm font-bold text-center max-w-lg animate-fade-in
                      ${feedback.correct ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}
                  `}>
                      {feedback.text}
                  </div>
              )}
          </div>
      )
  }

  // === PACKING CRISIS & LAZY SOLUTION ===
  return (
    <div className="w-full h-full flex flex-col items-center gap-6 p-4">
       
       {/* Dashboard */}
       <div className={`w-full max-w-2xl rounded-2xl p-6 shadow-lg border-l-8 transition-all duration-500 flex items-center justify-between
           ${mode === 'PACKING_CRISIS' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}
       `}>
           <div>
               <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                   <Gauge size={20} /> 性能监控 (Performance Monitor)
               </h3>
               <p className="text-xs text-slate-500 font-mono mt-1">
                   Mode: {mode === 'PACKING_CRISIS' ? 'COLUMN (Imperative)' : 'LAZY_COLUMN (Declarative)'}
               </p>
           </div>
           
           <div className="text-right">
               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active View Objects</div>
               <div className={`text-4xl font-black font-mono transition-all duration-300 ${mode === 'PACKING_CRISIS' ? 'text-red-600' : 'text-green-600'}`}>
                   {Math.floor(renderedCount)}
               </div>
           </div>
       </div>

       {/* Phone Simulator */}
       <div className="relative w-[300px] h-[500px] bg-slate-800 rounded-[3rem] border-8 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
           {/* Dynamic Island */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20"></div>
           
           {/* Screen Content */}
           <div 
             className="w-full h-full bg-[#FFF8E1] overflow-y-auto custom-scrollbar relative"
             onScroll={handleScroll}
           >
               <div className="p-4 pt-10 pb-20 space-y-3">
                   {/* In Crisis mode, we actually render fewer items visually to save the user's browser, 
                       but the counter simulates the load. In Lazy mode, we simulate smooth scroll. */}
                   {Array.from({ length: 20 }).map((_, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-amber-100">
                           <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700">
                               <Package size={20} />
                           </div>
                           <div className="flex-1">
                               <div className="h-4 bg-amber-100 rounded w-24 mb-1"></div>
                               <div className="h-3 bg-slate-100 rounded w-16"></div>
                           </div>
                           <span className="text-xs font-mono text-slate-300">#{i + 1 + Math.floor(scrollPos / 50)}</span>
                       </div>
                   ))}
                   
                   {mode === 'PACKING_CRISIS' && renderedCount < 1000 && (
                       <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-30">
                           <div className="flex flex-col items-center gap-2">
                               <Loader2 className="animate-spin text-red-500" size={40} />
                               <span className="text-red-500 font-bold text-xs animate-pulse">RENDERING ALL ITEMS...</span>
                           </div>
                       </div>
                   )}
               </div>
           </div>
       </div>

       {mode === 'PACKING_CRISIS' && renderedCount >= 1000 && (
           <button onClick={handleCrisisComplete} className="bg-red-500 text-white px-6 py-3 rounded-full font-bold animate-bounce shadow-lg hover:bg-red-600">
               <AlertTriangle className="inline mr-2" /> 手机发烫了！快停下！
           </button>
       )}
    </div>
  );
};

export default InteractiveLazyLab;
