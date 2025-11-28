
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Radio, Tent, Music, Trash2, HelpCircle, Edit3, Terminal, Sparkles, RefreshCw, Volume2, LogOut, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveCleanupLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: NOISE POLLUTION ===
  const [isInTent, setIsInTent] = useState(false);
  const [activeRadios, setActiveRadios] = useState<number[]>([]);
  const [noiseLevel, setNoiseLevel] = useState(0);

  // === LAB 2: CLEANUP FIX ===
  const [cleanRadioActive, setCleanRadioActive] = useState(false);

  // === LAB 3: CHANNEL SURF ===
  const [channel, setChannel] = useState("A");
  const [logs, setLogs] = useState<string[]>([]);

  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("DisposableEffect(lifecycleOwner) {\n  // Add observer...\n  onDispose {\n    // Remove observer...\n  }\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: NOISE POLLUTION ---
  const toggleTentChaos = () => {
      const nextState = !isInTent;
      setIsInTent(nextState);
      
      if (nextState) {
          // ENTERING: Add a radio (Leak)
          const newId = Date.now();
          setActiveRadios(prev => [...prev, newId]);
          setNoiseLevel(prev => Math.min(100, prev + 20));
      } else {
          // LEAVING: Do nothing! (Simulate forgetting onDispose)
          // Radios stay active
      }

      if (activeRadios.length >= 3) {
          setTimeout(onComplete, 2000);
      }
  };

  // --- LOGIC: CLEANUP FIX ---
  const toggleTentFix = () => {
      const nextState = !isInTent;
      setIsInTent(nextState);
      
      if (nextState) {
          // Enter -> Register
          setCleanRadioActive(true);
      } else {
          // Leave -> Unregister (Simulate onDispose)
          setCleanRadioActive(false);
          setTimeout(onComplete, 2000);
      }
  };

  // --- LOGIC: CHANNEL SURF ---
  const changeChannel = (newCh: string) => {
      if (channel === newCh) return;
      
      // Simulate Dispose Old -> Effect New sequence
      setLogs(prev => [...prev, `🛑 Unregister Channel ${channel}`]);
      setTimeout(() => {
          setChannel(newCh);
          setLogs(prev => [...prev, `✅ Register Channel ${newCh}`]);
          if (logs.length > 2) setTimeout(onComplete, 2000);
      }, 500);
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'ORDER_B') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'ORDER_A': return { correct: false, text: "错误。不能先注册新资源再清理旧资源，这可能导致资源冲突（如占用同一个端口）。" };
          case 'ORDER_B': return { correct: true, text: "正确！Compose 总是先执行旧的 onDispose 清理现场，然后再运行新的 Effect 代码块。" };
          case 'ORDER_C': return { correct: false, text: "错误。onDispose 是清理操作，不会在 Effect 启动前执行。" };
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
                Check for DisposableEffect, addObserver, and removeObserver inside onDispose.
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

  if (mode === 'NOISE_POLLUTION' || mode === 'CLEANUP_FIX') {
      const isFix = mode === 'CLEANUP_FIX';
      const radiosToShow = isFix ? (cleanRadioActive ? [1] : []) : activeRadios;

      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="flex gap-8 items-end">
                  {/* Tent */}
                  <div className={`transition-all duration-500 relative ${isInTent ? 'scale-110' : 'scale-100 opacity-80'}`}>
                      <Tent size={120} className={isInTent ? "text-lime-600 fill-lime-100" : "text-slate-400"} />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-xs bg-white/80 px-2 rounded">
                          {isInTent ? "In Composition" : "Disposed"}
                      </div>
                  </div>

                  <button 
                    onClick={isFix ? toggleTentFix : toggleTentChaos}
                    className={`px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${isInTent ? 'bg-red-500 text-white' : 'bg-lime-500 text-white'}`}
                  >
                      {isInTent ? <LogOut size={20}/> : <Radio size={20}/>}
                      {isInTent ? "Leave Tent" : "Enter Tent"}
                  </button>
              </div>

              {/* Resource Monitor */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-slate-200 w-full max-w-md min-h-[160px]">
                  <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4 flex justify-between">
                      <span>Active Resources (Radios)</span>
                      {isFix ? <span className="text-green-500">Auto-Cleanup: ON</span> : <span className="text-red-500">Auto-Cleanup: OFF</span>}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4">
                      {radiosToShow.length === 0 && <span className="text-slate-300 text-sm italic">No active radios. Silence.</span>}
                      {radiosToShow.map((id, index) => (
                          <div key={id} className="relative animate-bounce-in">
                              <Radio size={40} className={isFix ? "text-green-500" : "text-red-500"} />
                              <Music size={16} className="absolute -top-2 -right-2 text-blue-400 animate-pulse" />
                              {!isFix && <span className="absolute -bottom-4 text-[10px] font-mono text-red-500">#{index+1}</span>}
                          </div>
                      ))}
                  </div>
                  
                  {!isFix && activeRadios.length >= 3 && (
                      <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-center animate-pulse flex items-center justify-center gap-2">
                          <Volume2 /> NOISE LEVEL CRITICAL!
                      </div>
                  )}
              </div>
          </div>
      )
  }

  if (mode === 'CHANNEL_SURF') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-lime-50 p-6 rounded-2xl shadow-inner border-2 border-lime-200 w-full max-w-md flex flex-col items-center gap-6">
                  <div className="text-lime-800 font-bold text-lg">Current Key: Channel {channel}</div>
                  
                  <div className="flex gap-4">
                      {['A', 'B', 'C'].map(ch => (
                          <button 
                            key={ch}
                            onClick={() => changeChannel(ch)}
                            disabled={channel === ch}
                            className={`w-12 h-12 rounded-full font-bold shadow transition-all ${channel === ch ? 'bg-lime-600 text-white scale-110 ring-4 ring-lime-200' : 'bg-white text-lime-700 hover:bg-lime-100'}`}
                          >
                              {ch}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="w-full max-w-md bg-slate-800 rounded-xl p-4 font-mono text-xs text-green-400 min-h-[200px] flex flex-col gap-2 shadow-2xl border-4 border-slate-700">
                  <div className="text-slate-500 border-b border-slate-700 pb-2 mb-2">System Logs</div>
                  {logs.map((log, i) => (
                      <div key={i} className="animate-slide-in-right border-l-2 border-green-500 pl-2">
                          {log}
                      </div>
                  ))}
                  {logs.length === 0 && <span className="text-slate-600">// Waiting for key change...</span>}
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'ORDER_B';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-lime-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-lime-100 p-2 rounded-full"><HelpCircle className="text-lime-600" /></div>
                    <h3 className="text-xl font-bold text-lime-900">执行顺序测验</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    当 `DisposableEffect(key)` 中的 key 发生变化时，发生的顺序是：
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'ORDER_A', label: '1. 注册新资源 -> 2. 清理旧资源' },
                        { val: 'ORDER_B', label: '1. 清理旧资源 -> 2. 注册新资源' },
                        { val: 'ORDER_C', label: '1. 注册新资源 (onDispose 不执行)' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'ORDER_B';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-lime-400 hover:bg-lime-50 text-slate-700";
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
            <div className="bg-[#ECFCCB] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-lime-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-lime-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：清理函数
                    </h3>
                    <div className="bg-lime-100 p-4 rounded-lg border border-lime-300 mb-4 font-mono text-sm text-lime-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-lime-300 text-lime-900 focus:border-lime-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Disposed Correctly!</p>}
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
                    <p className="text-lime-200 text-sm font-mono"><span className="text-lime-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-lime-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-lime-500">
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

export default InteractiveCleanupLab;
