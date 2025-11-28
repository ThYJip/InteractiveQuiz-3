
import React, { useState, useEffect, useRef } from 'react';
import { InteractiveState } from './types';
import { Loader2, Trash2, Copy, Bookmark, Undo2, LogIn, Home, Settings, HelpCircle, Terminal, Sparkles, MapPin, Footprints, Layers } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveOptionsLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: LOGIN TRAP ===
  const [loginStack, setLoginStack] = useState<string[]>(['Login']);
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [cleanMode, setCleanMode] = useState(false);

  // === LAB 2: CLONE ATTACK ===
  const [cloneStack, setCloneStack] = useState<string[]>(['Home']);
  const [singleTopMode, setSingleTopMode] = useState(false);

  // === LAB 3: AMNESIA TAB ===
  const [tab, setTab] = useState<'List' | 'Settings'>('List');
  const [scrollPos, setScrollPos] = useState(0);
  const [savedPos, setSavedPos] = useState(0);
  const [saveStateMode, setSaveStateMode] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === AI ===
  const [userCode, setUserCode] = useState("navController.navigate(\"home\") {\n  // ...\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: LOGIN TRAP ---
  const handleLogin = () => {
      if (cleanMode) {
          // popUpTo("Login") inclusive = true
          setLoginStack(['Home']);
          setCurrentScreen('Home');
      } else {
          // Standard push
          setLoginStack(prev => [...prev, 'Home']);
          setCurrentScreen('Home');
      }
  };

  const handleBack = () => {
      if (loginStack.length > 1) {
          const newStack = loginStack.slice(0, -1);
          setLoginStack(newStack);
          setCurrentScreen(newStack[newStack.length - 1]);
      } else {
          // Exit app simulation
          setLoginStack([]);
          setCurrentScreen('EXIT');
          setTimeout(onComplete, 1500); // Win condition if clean
      }
  };

  // --- LOGIC: CLONE ATTACK ---
  const handleNavHome = () => {
      if (singleTopMode) {
          // If top is home, do nothing (or re-select)
          if (cloneStack[cloneStack.length - 1] !== 'Home') {
              setCloneStack(prev => [...prev, 'Home']);
          }
      } else {
          setCloneStack(prev => [...prev, 'Home']);
      }
      
      if (singleTopMode) setTimeout(onComplete, 2000);
  };

  // --- LOGIC: AMNESIA TAB ---
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (tab === 'List') {
          setScrollPos(e.currentTarget.scrollTop);
      }
  };

  const switchTab = (newTab: 'List' | 'Settings') => {
      if (newTab === tab) return;
      
      if (tab === 'List') {
          // Leaving list
          if (saveStateMode) setSavedPos(scrollPos);
          else setSavedPos(0); // Reset if not saving
      }
      
      setTab(newTab);
  };

  // Effect to restore scroll when switching back to List
  useEffect(() => {
      if (tab === 'List' && listRef.current) {
          if (saveStateMode) {
              listRef.current.scrollTop = savedPos;
          } else {
              listRef.current.scrollTop = 0;
          }
      }
  }, [tab, saveStateMode, savedPos]);

  useEffect(() => {
      if (mode === 'AMNESIA_TAB' && saveStateMode && savedPos > 50 && tab === 'List') {
          setTimeout(onComplete, 2000);
      }
  }, [mode, saveStateMode, savedPos, tab, onComplete]);


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'POP_ALL') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'JUST_NAV': return { correct: false, text: "错误。直接 navigate 会把 Login 压在 Setting 之上。按返回键又会回到 Setting。" };
          case 'POP_ONE': return { correct: false, text: "错误。只弹出上一页是不够的，回退栈里可能还有其他页面。" };
          case 'POP_ALL': return { correct: true, text: "正确！使用 popUpTo(0) 或 popUpTo(startDestination) inclusive=true 可以清空整个栈，确保用户无法返回。" };
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
                Check for popUpTo with saveState, launchSingleTop, and restoreState.
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

  if (mode === 'LOGIN_TRAP') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="flex gap-4 items-center bg-white/80 p-2 rounded-lg border border-yellow-200">
                  <span className="font-bold text-slate-700 text-sm">Mode:</span>
                  <button 
                    onClick={() => { setCleanMode(false); setLoginStack(['Login']); setCurrentScreen('Login'); }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${!cleanMode ? 'bg-red-500 text-white' : 'bg-slate-200'}`}
                  >
                      Default (Trap)
                  </button>
                  <button 
                    onClick={() => { setCleanMode(true); setLoginStack(['Login']); setCurrentScreen('Login'); }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${cleanMode ? 'bg-green-500 text-white' : 'bg-slate-200'}`}
                  >
                      Clean (popUpTo)
                  </button>
              </div>

              <div className="flex w-full max-w-xl gap-4 h-64">
                  {/* Visual Stack */}
                  <div className="w-1/3 bg-slate-800 rounded-xl p-4 flex flex-col-reverse gap-2 overflow-y-auto border-2 border-yellow-900/30">
                      <div className="text-xs text-slate-500 font-bold uppercase text-center mb-2 sticky bottom-0">Back Stack</div>
                      {loginStack.map((route, i) => (
                          <div key={i} className="bg-white p-2 rounded text-slate-800 text-sm font-mono shadow animate-slide-up flex items-center gap-2">
                              <span className="bg-yellow-100 text-yellow-600 text-[10px] px-1 rounded">{i}</span>
                              {route}
                          </div>
                      ))}
                  </div>

                  {/* Screen Simulation */}
                  <div className="flex-1 bg-white rounded-2xl border-4 border-slate-300 shadow-xl relative flex flex-col items-center justify-center p-4 overflow-hidden">
                      {currentScreen === 'EXIT' ? (
                          <div className="text-2xl font-black text-slate-400">APP CLOSED</div>
                      ) : (
                          <>
                              <div className="absolute top-2 left-2 text-xs font-bold text-slate-400">{currentScreen} Screen</div>
                              
                              {currentScreen === 'Login' && (
                                  <button onClick={handleLogin} className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-600">
                                      Login
                                  </button>
                              )}
                              
                              {currentScreen === 'Home' && (
                                  <div className="text-center">
                                      <Home size={48} className="text-yellow-600 mx-auto mb-2" />
                                      <p className="text-sm text-slate-600">Welcome Home!</p>
                                  </div>
                              )}
                          </>
                      )}
                  </div>
              </div>

              {currentScreen !== 'EXIT' && (
                  <button onClick={handleBack} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all">
                      <Undo2 size={18} /> Press Back Button
                  </button>
              )}
          </div>
      )
  }

  if (mode === 'CLONE_ATTACK') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="flex gap-4 items-center bg-white/80 p-2 rounded-lg border border-yellow-200">
                  <span className="font-bold text-slate-700 text-sm">Config:</span>
                  <button 
                    onClick={() => { setSingleTopMode(false); setCloneStack(['Home']); }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${!singleTopMode ? 'bg-red-500 text-white' : 'bg-slate-200'}`}
                  >
                      Standard (Clones)
                  </button>
                  <button 
                    onClick={() => { setSingleTopMode(true); setCloneStack(['Home']); }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${singleTopMode ? 'bg-green-500 text-white' : 'bg-slate-200'}`}
                  >
                      SingleTop
                  </button>
              </div>

              <div className="w-full max-w-sm bg-slate-800 rounded-xl p-4 flex flex-col-reverse gap-2 h-64 overflow-y-auto border-4 border-slate-700 shadow-2xl relative">
                  <div className="text-xs text-slate-500 font-bold uppercase text-center mb-2 sticky bottom-0 bg-slate-800 py-1 z-10">Back Stack (Size: {cloneStack.length})</div>
                  {cloneStack.map((route, i) => (
                      <div key={i} className="bg-white p-2 rounded text-slate-800 text-sm font-mono shadow animate-pop-in flex items-center gap-2 shrink-0">
                          <Layers size={14} className="text-slate-400" />
                          {route} #{i+1}
                      </div>
                  ))}
              </div>

              <button 
                onClick={handleNavHome}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center gap-2"
              >
                  <Home size={24} /> Navigate("Home")
              </button>
              
              {!singleTopMode && cloneStack.length > 5 && (
                  <p className="text-red-500 font-bold animate-bounce">Too many clones! 😱</p>
              )}
          </div>
      )
  }

  if (mode === 'AMNESIA_TAB') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <div className="flex gap-4 items-center bg-white/80 p-2 rounded-lg border border-yellow-200">
                  <span className="font-bold text-slate-700 text-sm">State:</span>
                  <button 
                    onClick={() => { setSaveStateMode(false); setSavedPos(0); setScrollPos(0); if(listRef.current) listRef.current.scrollTop = 0; }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${!saveStateMode ? 'bg-red-500 text-white' : 'bg-slate-200'}`}
                  >
                      Amnesia (Reset)
                  </button>
                  <button 
                    onClick={() => { setSaveStateMode(true); }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${saveStateMode ? 'bg-green-500 text-white' : 'bg-slate-200'}`}
                  >
                      Remember (SaveState)
                  </button>
              </div>

              <div className="w-[300px] h-[450px] bg-white rounded-[2rem] border-8 border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="flex-1 overflow-hidden relative">
                      {tab === 'List' ? (
                          <div 
                            ref={listRef}
                            onScroll={handleScroll}
                            className="w-full h-full overflow-y-auto bg-yellow-50 p-4 scroll-smooth"
                          >
                              <h3 className="font-bold text-yellow-800 mb-4">Recipe List</h3>
                              {[...Array(20)].map((_, i) => (
                                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm mb-3 flex items-center gap-3">
                                      <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center font-bold text-yellow-700">{i+1}</div>
                                      <div className="h-4 bg-slate-100 rounded w-24"></div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center flex-col gap-4 text-slate-400">
                              <Settings size={48} />
                              <span className="font-bold">Settings Screen</span>
                          </div>
                      )}
                  </div>

                  {/* Bottom Nav */}
                  <div className="h-16 bg-white border-t border-slate-200 flex justify-around items-center shrink-0 z-10">
                      <button 
                        onClick={() => switchTab('List')}
                        className={`p-2 rounded-lg flex flex-col items-center ${tab === 'List' ? 'text-yellow-600' : 'text-slate-400'}`}
                      >
                          <Home size={20} />
                          <span className="text-[10px] font-bold">List</span>
                      </button>
                      <button 
                        onClick={() => switchTab('Settings')}
                        className={`p-2 rounded-lg flex flex-col items-center ${tab === 'Settings' ? 'text-yellow-600' : 'text-slate-400'}`}
                      >
                          <Settings size={20} />
                          <span className="text-[10px] font-bold">Settings</span>
                      </button>
                  </div>
              </div>
              
              <div className="text-center text-xs text-slate-500 font-mono bg-white px-4 py-2 rounded shadow">
                  Scroll Pos: {Math.floor(scrollPos)} | Saved: {Math.floor(savedPos)}
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'POP_ALL';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-yellow-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow-100 p-2 rounded-full"><HelpCircle className="text-yellow-600" /></div>
                    <h3 className="text-xl font-bold text-yellow-900">清理测验</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    为了实现“注销”功能（跳转到登录页，并清空历史栈），应该如何配置？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'JUST_NAV', label: '直接 navigate("login")' },
                        { val: 'POP_ONE', label: '先 popBackStack() 再 navigate' },
                        { val: 'POP_ALL', label: 'popUpTo(0) { inclusive = true }' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'POP_ALL';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-yellow-400 hover:bg-yellow-50 text-slate-700";
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
            <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-yellow-700">
                <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm font-bold">
                        <Terminal size={18} /> Rin's Proving Ground
                    </div>
                </div>
                <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                    <p className="text-yellow-200 text-sm font-mono"><span className="text-yellow-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-500 disabled:opacity-50">
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

export default InteractiveOptionsLab;
