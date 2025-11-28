
import React, { useState, useEffect, useRef } from 'react';
import { InteractiveState } from './types';
import { Loader2, Mountain, Footprints, Binoculars, Zap, HelpCircle, Edit3, Terminal, Sparkles, AlertTriangle, ArrowUp } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveDerivedLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1 & 2: HIKING ===
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stamina, setStamina] = useState(100);
  const [recompCount, setRecompCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  // === LAB 3: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 4: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 5: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("val listState = rememberLazyListState()\nval showButton by remember {\n  derivedStateOf { ... }\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: HIKING ---
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const top = e.currentTarget.scrollTop;
      setScrollPos(top);

      if (mode === 'HIKING_EXHAUSTION') {
          // BAD: Logic runs on EVERY scroll tick
          setRecompCount(c => c + 1); // Simulate recomposition
          setStamina(prev => Math.max(0, prev - 2)); 
          setShowButton(top > 100); // Direct calculation
          
          if (top > 300 && stamina <= 0) {
              // Fail state or just finish to show lesson? 
              // Let's just finish when they scroll enough but show low stamina
              setTimeout(onComplete, 1500);
          }
      } else if (mode === 'BINOCULARS_FIX') {
          // GOOD: Logic only triggers when result changes
          const shouldShow = top > 100;
          if (shouldShow !== showButton) {
              setShowButton(shouldShow);
              setRecompCount(c => c + 1); // Only recompose on change
          }
          // Stamina doesn't drop
          if (top > 300) {
              setTimeout(onComplete, 1500);
          }
      }
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'FILTER') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'MEMORY': return { correct: false, text: "错误。remember 负责记忆，但不能过滤变化。" };
          case 'FILTER': return { correct: true, text: "正确！它像过滤器一样，只有当计算结果发生变化时，才通知 UI 更新。" };
          case 'ASYNC': return { correct: false, text: "错误。derivedStateOf 是同步计算，不处理异步任务。" };
          default: return null;
      }
  };

  // --- LOGIC: TYPING ---
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setTypedCode(input);
      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
      if (config.targetCode && normalize(input) === normalize(config.targetCode)) {
          setIsTypedCorrect(true);
          setTimeout(onComplete, 1500);
      }
  };

  // --- LOGIC: AI CHECK ---
  const checkCodeWithAI = async () => {
      setAiLoading(true);
      setAiFeedback(null);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `
                You are Rin Shima. Task: ${config.assignmentPrompt}.
                User Code: "${userCode}".
                Check for remember, derivedStateOf, and correct logic (index > 5).
                Respond JSON: { "pass": boolean, "message": "string (Rin persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          setAiFeedback({ pass: false, msg: "AI 离线，模拟通过！" });
          setTimeout(onComplete, 2000);
      } finally {
          setAiLoading(false);
      }
  };

  // === RENDERERS ===

  if (mode === 'HIKING_EXHAUSTION' || mode === 'BINOCULARS_FIX') {
      const isBad = mode === 'HIKING_EXHAUSTION';
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <div className="flex justify-between w-full max-w-md px-4">
                  <div className={`flex items-center gap-2 font-bold ${isBad ? 'text-red-500' : 'text-green-600'}`}>
                      {isBad ? <Zap className="animate-pulse" /> : <Binoculars />}
                      {isBad ? "Mode: DIRECT READ" : "Mode: DERIVED STATE"}
                  </div>
                  <div className="font-mono text-sm bg-slate-100 px-2 py-1 rounded border border-slate-300">
                      Recompositions: {recompCount}
                  </div>
              </div>

              {/* Stamina Bar */}
              <div className="w-full max-w-md bg-slate-200 h-4 rounded-full overflow-hidden border border-slate-300">
                  <div 
                    className={`h-full transition-all duration-300 ${stamina < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${stamina}%` }}
                  ></div>
              </div>
              <div className="text-xs font-bold text-slate-500">NADESHIKO'S STAMINA</div>

              {/* Scroll Container */}
              <div className="relative w-64 h-96 border-8 border-slate-700 rounded-3xl bg-white shadow-2xl overflow-hidden">
                  <div className="absolute top-0 w-full h-12 bg-sky-100 z-10 border-b flex items-center justify-center text-xs font-bold text-sky-800">
                      MT. FUJI TRAIL
                  </div>
                  
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="w-full h-full overflow-y-auto pt-12 pb-20 relative"
                  >
                      <div className="h-[1000px] bg-gradient-to-b from-green-50 to-green-200 p-4">
                          <div className="flex flex-col gap-8">
                              {[...Array(10)].map((_, i) => (
                                  <div key={i} className="flex items-center gap-2 opacity-50">
                                      <Mountain size={24} className="text-green-700" />
                                      <span className="text-xs font-mono text-green-800">Checkpoint #{i}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* The FAB */}
                  {showButton && (
                      <div className="absolute bottom-6 right-6 w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white animate-scale-in">
                          <ArrowUp />
                      </div>
                  )}

                  {/* Recomposition Flash Indicator */}
                  <div key={recompCount} className={`absolute inset-0 pointer-events-none ${isBad ? 'bg-red-500/20' : 'bg-green-500/10'} opacity-0 animate-flash`} />
              </div>

              {isBad && stamina < 50 && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold animate-bounce flex items-center gap-2">
                      <AlertTriangle /> TOO MUCH SHOUTING!
                  </div>
              )}
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'FILTER';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-green-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-2 rounded-full"><HelpCircle className="text-green-600" /></div>
                    <h3 className="text-xl font-bold text-green-900">核心作用</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    `derivedStateOf` 在性能优化中最主要的作用是什么？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'MEMORY', label: '缓存数据，防止丢失' },
                        { val: 'FILTER', label: '将高频状态转换为低频状态，减少重组' },
                        { val: 'ASYNC', label: '开启异步线程进行计算' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'FILTER';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-green-400 hover:bg-green-50 text-slate-700";
                        }

                        return (
                            <button key={opt.val} onClick={() => handleQuiz(opt.val)} className={btnClass} disabled={isSolved}>
                                {opt.label}
                            </button>
                        )
                    })}
                </div>
                {feedback && (
                    <div className={`mt-6 p-4 rounded-xl text-sm font-bold text-center animate-fade-in
                        ${feedback.correct ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}
                    `}>
                        {feedback.text}
                    </div>
                )}
            </div>
        </div>
      )
  }

  if (mode === 'GUIDED_TYPING') {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-[#F0FDF4] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-green-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：望远镜配方
                    </h3>
                    <div className="bg-green-100 p-4 rounded-lg border border-green-300 mb-4 font-mono text-sm text-green-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-green-300 text-green-900 focus:border-green-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Derived State Mastered!</p>}
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
                    <p className="text-green-200 text-sm font-mono"><span className="text-green-400">#</span> {config.assignmentPrompt}</p>
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
                    {!aiFeedback?.pass && (
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-500">
                            {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} 提交
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
  }

  return <div>Unknown Mode</div>;
};

export default InteractiveDerivedLab;
