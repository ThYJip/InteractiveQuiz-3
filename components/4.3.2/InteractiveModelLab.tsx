
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, AlertTriangle, CheckCircle2, Box, Database, Sparkles, Server, Terminal, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveModelLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: CHAOS HANDS ===
  const [chaosLoading, setChaosLoading] = useState(false);
  const [chaosError, setChaosError] = useState(false);
  const [chaosData, setChaosData] = useState(false);

  // === LAB 2: BENTO BOX ===
  const [bentoState, setBentoState] = useState<{loading: boolean, data: string[], error: string|null}>({
      loading: false, data: [], error: null
  });

  // === LAB 3: VENDING MACHINE ===
  type MachineState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
  const [machineState, setMachineState] = useState<MachineState>('IDLE');

  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === AI ===
  const [userCode, setUserCode] = useState("sealed interface CheckInState {\n  // ...\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: CHAOS ---
  // Just simple toggles, visual check is enough

  // --- LOGIC: BENTO ---
  const handleBentoAction = (action: 'LOAD' | 'SUCCESS' | 'FAIL') => {
      // Simulate .update { it.copy(...) }
      if (action === 'LOAD') setBentoState(prev => ({ ...prev, loading: true, error: null }));
      if (action === 'SUCCESS') setBentoState({ loading: false, data: ['Onigiri', 'Tea'], error: null }); // Atomic replace
      if (action === 'FAIL') setBentoState({ loading: false, data: [], error: "Network Error" });
      
      if (action === 'SUCCESS') setTimeout(onComplete, 2000);
  };

  // --- LOGIC: MACHINE ---
  const handleMachineAction = (action: 'INSERT' | 'DISPENSE' | 'JAM') => {
      if (action === 'INSERT') setMachineState('LOADING');
      if (action === 'DISPENSE') setMachineState('SUCCESS');
      if (action === 'JAM') setMachineState('ERROR');

      if (action === 'DISPENSE') setTimeout(onComplete, 2000);
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'DATA_CLASS') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'DATA_CLASS': return { correct: true, text: "正确！列表数据和过滤开关是可以共存的，它们不是互斥关系，适合组合在 Data Class 中。" };
          case 'SEALED': return { correct: false, text: "错误。Sealed Interface 是互斥的。你不能在处于'列表显示'状态的同时又处于'开关开启'状态，这会导致逻辑极其复杂。" };
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
                Check for sealed interface syntax, data object for singletons, data class for state with data.
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

  if (mode === 'CHAOS_HANDS') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                  <h3 className="font-bold text-slate-700 mb-4 text-center">Current Screen State</h3>
                  
                  {/* The chaotic display */}
                  <div className="relative h-32 border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                      {chaosData && <div className="text-green-600 font-bold">List Data: [Item 1, Item 2]</div>}
                      {chaosError && (
                          <div className="absolute inset-0 bg-red-100/80 flex items-center justify-center text-red-600 font-bold backdrop-blur-sm">
                              Error: Failed!
                          </div>
                      )}
                      {chaosLoading && (
                          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                              <Loader2 className="animate-spin text-blue-500" size={40} />
                          </div>
                      )}
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-2 text-center">Try enabling incompatible states!</p>
              </div>

              <div className="flex gap-4">
                  <button onClick={() => setChaosLoading(!chaosLoading)} className={`px-4 py-2 rounded-lg border-2 font-bold ${chaosLoading ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-slate-300'}`}>Loading</button>
                  <button onClick={() => setChaosError(!chaosError)} className={`px-4 py-2 rounded-lg border-2 font-bold ${chaosError ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-slate-300'}`}>Error</button>
                  <button onClick={() => setChaosData(!chaosData)} className={`px-4 py-2 rounded-lg border-2 font-bold ${chaosData ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-slate-300'}`}>Data</button>
              </div>
              
              {(chaosLoading && chaosError) && (
                  <div className="bg-red-500 text-white px-6 py-2 rounded-full animate-bounce font-bold">
                      Wait, loading AND error? 😵‍💫
                  </div>
              )}
              {chaosData && chaosError && (
                  <div className="bg-orange-500 text-white px-6 py-2 rounded-full animate-bounce font-bold">
                      Data showed but error too? 🤔
                  </div>
              )}
              {(chaosLoading && chaosError && chaosData) && (
                  <button onClick={onComplete} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg animate-pulse hover:bg-purple-500">
                      It's a mess! Fix it!
                  </button>
              )}
          </div>
      )
  }

  if (mode === 'BENTO_BOX') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="w-64 h-64 bg-orange-50 rounded-3xl border-4 border-orange-200 shadow-xl flex flex-col overflow-hidden relative">
                  <div className="bg-orange-200 p-2 text-center font-bold text-orange-800 text-xs">UiState (Data Class)</div>
                  
                  <div className="flex-1 p-4 flex flex-col items-center justify-center gap-2">
                      {bentoState.loading ? (
                          <Loader2 className="animate-spin text-orange-500" />
                      ) : bentoState.error ? (
                          <div className="text-red-500 font-bold">{bentoState.error}</div>
                      ) : bentoState.data.length > 0 ? (
                          <div className="flex gap-2">
                              {bentoState.data.map(d => <span key={d} className="bg-white px-2 py-1 rounded shadow text-xs">{d}</span>)}
                          </div>
                      ) : (
                          <span className="text-slate-400">Empty Box</span>
                      )}
                  </div>
                  
                  {/* Code snippet visualization */}
                  <div className="bg-slate-800 text-green-400 text-[10px] font-mono p-2">
                      state.copy(isLoading={bentoState.loading.toString()})
                  </div>
              </div>

              <div className="flex gap-2">
                  <button onClick={() => handleBentoAction('LOAD')} className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600">Load</button>
                  <button onClick={() => handleBentoAction('SUCCESS')} className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600">Success</button>
                  <button onClick={() => handleBentoAction('FAIL')} className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600">Error</button>
              </div>
          </div>
      )
  }

  if (mode === 'VENDING_MACHINE') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="w-48 h-80 bg-slate-200 rounded-t-full border-4 border-slate-400 shadow-2xl relative flex flex-col items-center pt-8">
                  <div className="w-32 h-32 bg-black rounded-lg border-4 border-slate-500 flex items-center justify-center relative overflow-hidden">
                      {machineState === 'IDLE' && <div className="text-green-500 font-mono animate-pulse">READY</div>}
                      {machineState === 'LOADING' && <div className="text-yellow-500 font-mono">DISPENSING...</div>}
                      {machineState === 'SUCCESS' && <div className="text-blue-500 font-mono text-center">ENJOY!<br/>🧃</div>}
                      {machineState === 'ERROR' && <div className="text-red-500 font-mono font-bold border-2 border-red-500 p-1">OUT OF ORDER</div>}
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-2 w-32">
                      <button onClick={() => handleMachineAction('INSERT')} className="w-full bg-yellow-500 h-8 rounded text-[10px] font-bold text-yellow-900">COIN</button>
                      <button onClick={() => handleMachineAction('DISPENSE')} className="w-full bg-blue-500 h-8 rounded text-[10px] font-bold text-white">GET</button>
                      <button onClick={() => handleMachineAction('JAM')} className="w-full bg-red-500 h-8 rounded text-[10px] font-bold text-white col-span-2">KICK</button>
                  </div>
                  
                  <div className="absolute bottom-4 text-[10px] text-slate-500">Sealed Interface</div>
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'DATA_CLASS';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-violet-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-violet-100 p-2 rounded-full"><HelpCircle className="text-violet-600" /></div>
                    <h3 className="text-xl font-bold text-violet-900">设计选择题</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    场景：页面包含一个“新闻列表”和一个“仅看未读开关”。应该用哪种模型？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'SEALED', label: 'Sealed Interface (互斥)' },
                        { val: 'DATA_CLASS', label: 'Data Class (组合)' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'DATA_CLASS';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-violet-400 hover:bg-violet-50 text-slate-700";
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
            <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-violet-700">
                <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2 text-slate-300 font-mono text-sm font-bold">
                        <Terminal size={18} /> Rin's Proving Ground
                    </div>
                </div>
                <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                    <p className="text-violet-200 text-sm font-mono"><span className="text-violet-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-violet-500">
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

export default InteractiveModelLab;
