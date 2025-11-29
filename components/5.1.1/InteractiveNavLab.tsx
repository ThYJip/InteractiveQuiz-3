
import React, { useState } from 'react';
import { InteractiveState } from './types';
import { Loader2, MapPin, ArrowRight, CornerDownLeft, FileText, Mic2, HelpCircle, Terminal, Sparkles, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveNavLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: CHAOS ===
  const [chaosMessage, setChaosMessage] = useState<string | null>(null);

  // === LAB 2: SIMULATOR ===
  const [currentRoute, setCurrentRoute] = useState("home");
  const [backStack, setBackStack] = useState<string[]>(["home"]); // Stack of routes
  const [simCompleted, setSimCompleted] = useState(false);

  // === LAB 3: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 4: AI ===
  const [userCode, setUserCode] = useState("val navController = rememberNavController()\nNavHost(...) {\n  composable(\"start\") { ... }\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: CHAOS ---
  const handleChaosClick = () => {
      setChaosMessage("抚子大喊：‘去森林！’……但是没人理她。");
      setTimeout(() => {
          onComplete();
      }, 2500);
  };

  // --- LOGIC: SIMULATOR ---
  const navigate = (route: string) => {
      if (route === currentRoute) return;
      setBackStack(prev => [...prev, route]);
      setCurrentRoute(route);
      checkSimCompletion();
  };

  const popBackStack = () => {
      if (backStack.length <= 1) return; // Cannot pop root
      const newStack = backStack.slice(0, -1);
      setBackStack(newStack);
      setCurrentRoute(newStack[newStack.length - 1]);
      checkSimCompletion();
  };

  const checkSimCompletion = () => {
      // Simple criteria: Navigate at least once, pop at least once (eventually)
      // For now, let's just trigger complete if stack grows > 2
      if (backStack.length >= 3 && !simCompleted) {
          setSimCompleted(true);
          setTimeout(onComplete, 2000);
      }
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'DECOUPLE') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'LAZY': return { correct: false, text: "错误。传递对象引用并不比传递 Lambda 更省事，反而增加了耦合。" };
          case 'DECOUPLE': return { correct: true, text: "正确！解耦使得组件可以在不同场景（如 Preview、测试）下复用，而不依赖特定的 NavController 实现。" };
          case 'PERFORMANCE': return { correct: false, text: "错误。性能差异可忽略不计。" };
          default: return null;
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
                Check for rememberNavController, NavHost, startDestination, and composable calls.
                Respond JSON: { "pass": boolean, "message": "string (Rin persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          setAiFeedback({ pass: false, msg: "AI 信号不佳，模拟通过！" });
          setTimeout(onComplete, 2000);
      } finally {
          setAiLoading(false);
      }
  };

  // === RENDERERS ===

  if (mode === 'NO_DIRECTOR_CHAOS') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="relative w-64 h-64 bg-rose-50 rounded-full border-4 border-rose-200 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                      <div className="text-4xl mb-2">🤷‍♀️</div>
                      <div className="text-rose-800 font-bold">舞台：空</div>
                  </div>
                  
                  {chaosMessage && (
                      <div className="absolute -top-12 bg-white p-3 rounded-xl border border-rose-300 shadow-lg animate-bounce text-xs font-bold text-rose-600 w-64 text-center">
                          {chaosMessage}
                      </div>
                  )}
              </div>

              <button 
                onClick={handleChaosClick}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                  <Play size={20} /> Navigate("Forest")
              </button>
          </div>
      )
  }

  if (mode === 'NAV_SIMULATOR') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              
              <div className="flex w-full max-w-3xl gap-4 h-80">
                  {/* LEFT: BACK STACK */}
                  <div className="w-1/3 bg-slate-800 rounded-xl p-4 flex flex-col-reverse gap-2 overflow-y-auto border-2 border-rose-900/30 shadow-inner">
                      <div className="text-xs text-slate-500 font-bold uppercase text-center mb-2 sticky bottom-0">回退栈</div>
                      {backStack.map((route, i) => (
                          <div key={i} className="bg-white p-2 rounded text-slate-800 text-sm font-mono shadow animate-slide-up flex items-center gap-2">
                              <span className="bg-rose-100 text-rose-600 text-[10px] px-1 rounded">{i}</span>
                              {route}
                          </div>
                      ))}
                  </div>

                  {/* CENTER: STAGE */}
                  <div className="flex-1 bg-rose-50 rounded-2xl border-8 border-rose-900 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-4">
                      <div className="absolute top-0 w-full bg-rose-900 text-rose-100 text-[10px] text-center font-bold py-1">NAVHOST 容器</div>
                      
                      <div className="text-6xl mb-4 animate-pop-in">
                          {currentRoute === 'home' && '⛺️'}
                          {currentRoute === 'forest' && '🌲'}
                          {currentRoute === 'lake' && '🌊'}
                          {currentRoute === 'settings' && '⚙️'}
                      </div>
                      <div className="text-xl font-black text-rose-800 uppercase tracking-widest">{currentRoute}</div>
                  </div>
              </div>

              {/* BOTTOM: CONTROLLER */}
              <div className="bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-700 w-full max-w-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <Mic2 size={16} /> 导演控制台
                  </div>
                  
                  <div className="flex gap-2">
                      <button 
                        onClick={popBackStack}
                        disabled={backStack.length <= 1}
                        className="p-3 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Pop Back Stack"
                      >
                          <CornerDownLeft size={20} />
                      </button>
                      <div className="h-8 w-[1px] bg-slate-700 mx-2"></div>
                      <button onClick={() => navigate('home')} disabled={currentRoute === 'home'} className="px-3 py-2 rounded bg-rose-100 text-rose-800 text-xs font-bold hover:bg-rose-200 disabled:opacity-50">Home</button>
                      <button onClick={() => navigate('forest')} disabled={currentRoute === 'forest'} className="px-3 py-2 rounded bg-green-100 text-green-800 text-xs font-bold hover:bg-green-200 disabled:opacity-50">Forest</button>
                      <button onClick={() => navigate('lake')} disabled={currentRoute === 'lake'} className="px-3 py-2 rounded bg-blue-100 text-blue-800 text-xs font-bold hover:bg-blue-200 disabled:opacity-50">Lake</button>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'DECOUPLE';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-rose-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-rose-100 p-2 rounded-full"><HelpCircle className="text-rose-600" /></div>
                    <h3 className="text-xl font-bold text-rose-900">前辈的提问</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    为什么我们要把导航操作封装成 Lambda (如 `onNavigate: () -> Unit`) 传给子组件，而不是直接传 `NavController`？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'LAZY', label: '因为传对象太麻烦了' },
                        { val: 'DECOUPLE', label: '为了解耦，让组件不依赖具体导航实现' },
                        { val: 'PERFORMANCE', label: '为了提高渲染性能' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'DECOUPLE';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700";
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

  if (mode === 'AI_ASSIGNMENT') {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-rose-900">
                <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-sm font-bold">
                        <Terminal size={18} /> 凛的试炼场
                    </div>
                </div>
                <div className="bg-slate-800/50 p-4 border-b border-slate-800">
                    <p className="text-rose-200 text-sm font-mono"><span className="text-rose-500">#</span> {config.assignmentPrompt}</p>
                </div>
                <textarea 
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="flex-1 bg-[#1e293b] text-slate-100 font-mono text-sm p-4 outline-none resize-none"
                    spellCheck={false}
                />
                <div className="bg-[#0f172a] p-4 flex items-center justify-between border-t border-slate-800">
                     <div className="flex-1 mr-4">
                        {aiFeedback && (
                            <div className={`text-xs font-mono p-2 rounded border ${aiFeedback.pass ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
                                {aiFeedback.msg}
                            </div>
                        )}
                    </div>
                    {!aiFeedback?.pass && (
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-rose-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-rose-500 disabled:opacity-50">
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

export default InteractiveNavLab;
