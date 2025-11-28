
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Flame, Wind, Shield, RefreshCw, HelpCircle, Edit3, Terminal, Sparkles, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveEffectLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: STORM CRISIS ===
  const [requestCount, setRequestCount] = useState(0);
  const [recomposeCount, setRecomposeCount] = useState(0);
  const [isServerDown, setIsServerDown] = useState(false);

  // === LAB 2: SHELTER FIX ===
  const [safeRequestCount, setSafeRequestCount] = useState(0);
  const [isSheltered, setIsSheltered] = useState(false);

  // === LAB 3: KEY RELOAD ===
  const [userId, setUserId] = useState("User A");
  const [userData, setUserData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyReloadCount, setKeyReloadCount] = useState(0);

  // === LAB 4: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 5: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 6: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("LaunchedEffect(Unit) {\n  while(true) {\n    delay(1000)\n    timeLeft--\n  }\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: STORM CRISIS ---
  useEffect(() => {
      if (mode === 'STORM_CRISIS' && !isServerDown) {
          // Simulate frequent recomposition (The Storm)
          const interval = setInterval(() => {
              setRecomposeCount(c => c + 1);
              // SIDE EFFECT LEAK: Request fires on every "render"
              setRequestCount(c => c + 1);
          }, 200); 

          if (requestCount > 20) {
              setIsServerDown(true);
              clearInterval(interval);
              setTimeout(onComplete, 2000);
          }

          return () => clearInterval(interval);
      }
  }, [mode, requestCount, isServerDown, onComplete]);


  // --- LOGIC: SHELTER FIX ---
  // In a real component, useEffect(..., []) acts like LaunchedEffect(Unit)
  useEffect(() => {
      if (mode === 'SHELTER_FIX') {
          // LaunchedEffect(Unit) simulation
          setSafeRequestCount(c => c + 1);
          setIsSheltered(true);
          setTimeout(onComplete, 2500);
      }
  }, [mode, onComplete]); // Empty dependency array = Unit key


  // --- LOGIC: KEY RELOAD ---
  // LaunchedEffect(userId) simulation
  useEffect(() => {
      if (mode === 'KEY_RELOAD') {
          setLoading(true);
          setUserData(null);
          
          const timer = setTimeout(() => {
              setUserData(`Data for ${userId}`);
              setLoading(false);
              setKeyReloadCount(c => c + 1);
          }, 1000);

          return () => clearTimeout(timer);
      }
  }, [mode, userId]);

  useEffect(() => {
      if (mode === 'KEY_RELOAD' && keyReloadCount >= 2) {
          setTimeout(onComplete, 1000);
      }
  }, [keyReloadCount, mode, onComplete]);


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'USER_ID') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'UNIT': return { correct: false, text: "错误。Unit 是常量，意味着'只执行一次'，ID 变化时不会重新执行。" };
          case 'TRUE': return { correct: false, text: "错误。true 也是常量，效果同 Unit。" };
          case 'USER_ID': return { correct: true, text: "正确！将 userId 作为 key，当它变化时，旧协程取消，新协程启动，实现数据刷新。" };
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
                Check for LaunchedEffect, correct key usage, while loop, and delay.
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

  if (mode === 'STORM_CRISIS') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-indigo-900">Current Recomposition Count: {recomposeCount}</h3>
                  <div className="text-sm text-slate-500">Each recomposition triggers a request!</div>
              </div>

              <div className="relative w-64 h-64 bg-slate-800 rounded-full flex items-center justify-center border-4 border-indigo-900 overflow-hidden shadow-2xl">
                  {/* The Fire */}
                  {!isServerDown ? (
                      <div className="relative">
                          <Flame size={80} className="text-orange-500 animate-pulse" />
                          {/* The Wind blowing it out */}
                          <Wind size={60} className="absolute -right-10 top-0 text-cyan-300 animate-slide-left opacity-70" />
                      </div>
                  ) : (
                      <div className="flex flex-col items-center text-red-500 animate-bounce">
                          <AlertTriangle size={60} />
                          <span className="font-black text-xl">SERVER CRASHED</span>
                      </div>
                  )}
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-500 w-full max-w-sm">
                  <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-700">Network Requests</span>
                      <span className="text-2xl font-black text-red-600">{requestCount}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full transition-all duration-200" style={{ width: `${Math.min(requestCount * 5, 100)}%` }}></div>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'SHELTER_FIX') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-indigo-900">Status: Protected</h3>
                  <div className="text-sm text-slate-500">LaunchedEffect(Unit) only runs ONCE.</div>
              </div>

              <div className="relative w-64 h-64 bg-slate-800 rounded-full flex items-center justify-center border-4 border-indigo-900 shadow-2xl">
                  {/* The Sheltered Fire */}
                  <Flame size={80} className="text-orange-500 animate-pulse" />
                  
                  {/* The Shield */}
                  <div className="absolute inset-0 border-4 border-green-400 rounded-full opacity-50 animate-pulse-slow"></div>
                  <Shield size={40} className="absolute top-4 right-4 text-green-400" />
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500 w-full max-w-sm">
                  <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-700">Network Requests</span>
                      <span className="text-2xl font-black text-green-600">{safeRequestCount}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full transition-all duration-200" style={{ width: `${Math.min(safeRequestCount * 20, 100)}%` }}></div>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'KEY_RELOAD') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-200 w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-indigo-900">User Profile</h3>
                      <div className="flex gap-2">
                          <button 
                            onClick={() => setUserId('User A')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${userId === 'User A' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                          >
                              User A
                          </button>
                          <button 
                            onClick={() => setUserId('User B')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${userId === 'User B' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                          >
                              User B
                          </button>
                      </div>
                  </div>

                  <div className="h-32 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
                      {loading ? (
                          <div className="flex flex-col items-center gap-2 text-indigo-500">
                              <Loader2 className="animate-spin" size={32} />
                              <span className="text-xs font-bold">Fetching {userId}...</span>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-700 animate-fade-in">
                              <User size={40} className="text-indigo-400" />
                              <span className="font-bold text-lg">{userData}</span>
                          </div>
                      )}
                      
                      {/* Visualizing Key Change */}
                      <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono">
                          Key: {userId}
                      </div>
                  </div>
              </div>
              <p className="text-indigo-800 bg-indigo-100 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                  Change User to trigger LaunchedEffect!
              </p>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'USER_ID';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-indigo-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-100 p-2 rounded-full"><HelpCircle className="text-indigo-600" /></div>
                    <h3 className="text-xl font-bold text-indigo-900">前辈的提问</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    希望每次 `userId` 变化时重新请求数据，`LaunchedEffect` 的 key 应该填什么？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'UNIT', label: 'Unit' },
                        { val: 'TRUE', label: 'true' },
                        { val: 'USER_ID', label: 'userId' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'USER_ID';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
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
            <div className="bg-[#EEF2FF] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-indigo-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：防风咒语
                    </h3>
                    <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-300 mb-4 font-mono text-sm text-indigo-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-indigo-300 text-indigo-900 focus:border-indigo-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Effect Controlled!</p>}
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
                    <p className="text-blue-200 text-sm font-mono"><span className="text-indigo-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50">
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

export default InteractiveEffectLab;
