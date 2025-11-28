
import React, { useState, useEffect, useRef } from 'react';
import { InteractiveState } from './types';
import { Loader2, Tent, Home, RefreshCw, Smartphone, Battery, BatteryCharging, Zap, HelpCircle, Edit3, Terminal, Sparkles, Box, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveVMLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: FRAGILE TENT ===
  // Simulation: We force a "remount" by changing a key on the parent container
  const [tentKey, setTentKey] = useState(0); 
  const [tentLogs, setTentLogs] = useState(0); // This represents local state inside the tent component

  // === LAB 2: STURDY CABIN ===
  // Simulation: "ViewModel" state lives here (in the parent), surviving the tent remount
  const [cabinLogs, setCabinLogs] = useState(0); 
  const [cabinTentKey, setCabinTentKey] = useState(0);

  // === LAB 3: RADIO BATTERY ===
  const [isBackgrounded, setIsBackgrounded] = useState(false);
  const [badBattery, setBadBattery] = useState(100);
  const [goodBattery, setGoodBattery] = useState(100);
  
  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("class TimerViewModel : ViewModel() {\n  // ...\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: FRAGILE TENT ---
  const handleTentRotate = () => {
      // Simulate config change: Component unmounts and remounts -> State reset
      setTentKey(prev => prev + 1);
      setTentLogs(0); // Manually resetting to simulate the loss of state in React
      
      // Allow progression if user experienced the loss
      if (tentLogs > 0) {
          setTimeout(onComplete, 2000);
      }
  };

  // --- LOGIC: STURDY CABIN ---
  const handleCabinRotate = () => {
      // Simulate config change: Component unmounts (Key change)
      setCabinTentKey(prev => prev + 1);
      // BUT, cabinLogs (ViewModel state) is NOT reset!
      
      if (cabinLogs > 0) {
          setTimeout(onComplete, 2000);
      }
  };

  // --- LOGIC: RADIO BATTERY ---
  useEffect(() => {
      if (mode === 'RADIO_BATTERY') {
          const timer = setInterval(() => {
              // Bad Logic: Drains always
              setBadBattery(prev => Math.max(0, prev - 2));

              // Good Logic: Drains only if foregrounded
              if (!isBackgrounded) {
                  setGoodBattery(prev => Math.max(0, prev - 2));
              }
          }, 200);
          return () => clearInterval(timer);
      }
  }, [mode, isBackgrounded]);

  const handleToggleBackground = () => {
      setIsBackgrounded(prev => !prev);
      if (!isBackgrounded) {
          // User went to background, let them see the difference for a bit
          setTimeout(onComplete, 4000);
      }
  };


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'SURVIVE') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'DESTROY': return { correct: false, text: "错误。ViewModel 的设计初衷就是为了在 Activity 销毁重建（如旋转）时存活下来。" };
          case 'SURVIVE': return { correct: true, text: "正确！ViewModel 实例会保留，直到关联的 Scope（如 Activity）彻底结束。" };
          case 'RESET': return { correct: false, text: "错误。ViewModel 中的数据不会被重置，这正是它的价值所在。" };
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
                Check for:
                1. Class inheriting ViewModel
                2. Private MutableStateFlow
                3. Public StateFlow (asStateFlow)
                Respond JSON: { "pass": boolean, "message": "string (Rin persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          setAiFeedback({ pass: false, msg: "AI 信号不好，模拟通过！" });
          setTimeout(onComplete, 2000);
      } finally {
          setAiLoading(false);
      }
  };

  // === RENDERERS ===

  if (mode === 'FRAGILE_TENT') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-orange-800 flex items-center justify-center gap-2">
                      <Tent /> 临时帐篷 (UI)
                  </h3>
                  <div className="text-sm text-slate-500">点击添加木柴，然后旋转屏幕测试</div>
              </div>

              {/* The Tent Container - Re-renders on tentKey change */}
              <div key={tentKey} className="w-64 h-64 bg-orange-100 rounded-t-[4rem] border-b-8 border-orange-800 relative flex flex-col items-center justify-center shadow-xl animate-pop-in">
                  <div className="absolute -top-4 bg-orange-200 px-3 py-1 rounded-full text-xs font-bold text-orange-800 border border-orange-300">
                      Instance #{tentKey + 1}
                  </div>
                  
                  <div className="text-4xl font-black text-orange-900 mb-2">{tentLogs}</div>
                  <div className="text-xs font-bold text-orange-600 mb-4">LOGS COUNTED</div>
                  
                  <button 
                    onClick={() => setTentLogs(c => c + 1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold shadow active:scale-95 transition-all"
                  >
                      + Add Log
                  </button>
              </div>

              <button 
                onClick={handleTentRotate}
                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-700 active:scale-95 transition-all"
              >
                  <RefreshCw /> 模拟屏幕旋转 (Rotate)
              </button>
          </div>
      )
  }

  if (mode === 'STURDY_CABIN') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="flex gap-8 items-end">
                  {/* The Cabin (ViewModel) - Persists */}
                  <div className="w-40 h-40 bg-amber-800 rounded-lg relative flex flex-col items-center justify-center shadow-2xl border-4 border-amber-900">
                      <div className="absolute -top-8 w-0 h-0 border-l-[90px] border-r-[90px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-900"></div>
                      <span className="text-amber-100 font-bold text-xs bg-black/30 px-2 rounded mb-2">ViewModel</span>
                      <div className="text-4xl font-black text-white">{cabinLogs}</div>
                      <div className="text-[10px] text-amber-200 mt-1">SAFE STORAGE</div>
                  </div>

                  {/* The Tent (UI) - Recreates */}
                  <div key={cabinTentKey} className="w-32 h-32 bg-orange-100 rounded-t-[3rem] border-b-4 border-orange-800 relative flex flex-col items-center justify-end pb-4 shadow-lg animate-pop-in">
                      <span className="absolute -top-6 text-xs font-bold bg-white px-2 py-1 rounded border border-slate-200 shadow">
                          UI #{cabinTentKey + 1}
                      </span>
                      <button 
                        onClick={() => setCabinLogs(c => c + 1)}
                        className="bg-green-600 hover:bg-green-500 text-white w-10 h-10 rounded-full font-bold shadow active:scale-95 transition-all flex items-center justify-center"
                      >
                          +
                      </button>
                  </div>
              </div>

              <button 
                onClick={handleCabinRotate}
                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-700 active:scale-95 transition-all"
              >
                  <RefreshCw /> 模拟屏幕旋转 (Rotate)
              </button>
          </div>
      )
  }

  if (mode === 'RADIO_BATTERY') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="flex justify-center gap-8 w-full max-w-2xl">
                  {/* Bad Phone */}
                  <div className={`w-48 h-80 bg-slate-800 rounded-[2rem] border-4 border-slate-600 p-4 flex flex-col items-center relative transition-opacity duration-500 ${isBackgrounded ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="w-12 h-1 bg-slate-600 rounded mb-4"></div>
                      <div className="text-xs text-red-400 font-bold mb-2">collectAsState()</div>
                      <div className="flex-1 w-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden relative">
                          <div className="text-red-500 animate-pulse font-mono text-xs text-center">
                              Reading Stream...<br/>
                              {isBackgrounded ? "(Wasting Energy)" : ""}
                          </div>
                      </div>
                      
                      {/* Battery Indicator */}
                      <div className="mt-4 w-full h-4 bg-slate-700 rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full transition-all duration-200 ${badBattery < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{width: `${badBattery}%`}}
                          ></div>
                      </div>
                      <div className="text-xs text-white mt-1">{Math.floor(badBattery)}%</div>
                  </div>

                  {/* Good Phone */}
                  <div className={`w-48 h-80 bg-slate-800 rounded-[2rem] border-4 border-green-600 p-4 flex flex-col items-center relative transition-opacity duration-500 ${isBackgrounded ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="w-12 h-1 bg-slate-600 rounded mb-4"></div>
                      <div className="text-xs text-green-400 font-bold mb-2">WithLifecycle()</div>
                      <div className="flex-1 w-full bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden relative">
                          {isBackgrounded ? (
                              <div className="text-slate-500 font-mono text-xs text-center flex flex-col items-center">
                                  <BatteryCharging size={24}/>
                                  <span>Paused</span>
                              </div>
                          ) : (
                              <div className="text-green-500 animate-pulse font-mono text-xs text-center">Reading Stream...</div>
                          )}
                      </div>
                      
                      {/* Battery Indicator */}
                      <div className="mt-4 w-full h-4 bg-slate-700 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-green-500 transition-all duration-200"
                            style={{width: `${goodBattery}%`}}
                          ></div>
                      </div>
                      <div className="text-xs text-white mt-1">{Math.floor(goodBattery)}%</div>
                  </div>
              </div>

              <button 
                onClick={handleToggleBackground}
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                  <Smartphone /> 
                  {isBackgrounded ? "Return to App (Foreground)" : "Go Home (Background)"}
              </button>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'SURVIVE';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-orange-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-100 p-2 rounded-full"><HelpCircle className="text-orange-600" /></div>
                    <h3 className="text-xl font-bold text-orange-900">生存测验</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    当屏幕旋转（Activity 销毁并重建）时，ViewModel 会发生什么？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'DESTROY', label: '也会被销毁并重建' },
                        { val: 'RESET', label: '保留实例，但数据重置为初始值' },
                        { val: 'SURVIVE', label: '存活下来，保持原有数据不变' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'SURVIVE';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-orange-400 hover:bg-orange-50 text-slate-700";
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
            <div className="bg-[#FFF7ED] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-orange-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-orange-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：省电咒语
                    </h3>
                    <div className="bg-orange-100 p-4 rounded-lg border border-orange-300 mb-4 font-mono text-sm text-orange-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-orange-300 text-orange-900 focus:border-orange-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Power Optimized!</p>}
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
                    <p className="text-orange-200 text-sm font-mono"><span className="text-orange-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-500">
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

export default InteractiveVMLab;
