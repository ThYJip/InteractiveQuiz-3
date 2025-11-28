import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Flame, LogOut, Plus, HelpCircle, Edit3, Terminal, Sparkles, MousePointerClick, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveButtonLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: HIERARCHY CRISIS ===
  const [crisisFeedback, setCrisisFeedback] = useState("");

  // === LAB 2: HIERARCHY FIX ===
  const [assignments, setAssignments] = useState<{ignite: string|null, wood: string|null, cancel: string|null}>({ ignite: null, wood: null, cancel: null });

  // === LAB 3: ENABLED LOGIC ===
  const [woodCount, setWoodCount] = useState(0);
  const [isFireLit, setIsFireLit] = useState(false);

  // === LAB 4: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 5: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 6: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("Button(\n  onClick = { ... },\n  enabled = true\n) { Text(\"Login\") }");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: HIERARCHY CRISIS ---
  const handleCrisisClick = (action: string) => {
      if (action === 'CANCEL') {
          setCrisisFeedback("Oh no! You cancelled the setup! 😱");
          setTimeout(onComplete, 2000);
      } else {
          setCrisisFeedback("Is this the right one? Hard to tell...");
      }
  };

  // --- LOGIC: HIERARCHY FIX ---
  const handleAssign = (type: string, role: 'ignite' | 'wood' | 'cancel') => {
      setAssignments(prev => {
          const next = { ...prev, [role]: type };
          if (next.ignite === 'SOLID' && next.wood === 'OUTLINED' && next.cancel === 'TEXT') {
              setTimeout(onComplete, 1500);
          }
          return next;
      });
  };

  // --- LOGIC: ENABLED LOGIC ---
  const handleIgnite = () => {
      if (woodCount > 0) {
          setIsFireLit(true);
          setTimeout(onComplete, 2500);
      }
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'TEXT') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'SOLID': return { correct: false, text: "错误。实心按钮太显眼了，会诱导用户点击'取消'。" };
          case 'OUTLINED': return { correct: false, text: "错误。虽然比实心弱，但在对话框里还是显得太重了。" };
          case 'TEXT': return { correct: true, text: "正确！TextButton 视觉干扰最小，适合作为'退出路径'或次要操作。" };
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
                Check if 'enabled' parameter is used correctly.
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

  if (mode === 'HIERARCHY_CRISIS') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-slate-200 p-8 rounded-xl shadow-inner w-full max-w-sm flex flex-col gap-4">
                  <div className="text-center font-bold text-slate-500 mb-4">CONFUSING PANEL</div>
                  {['IGNITE', 'ADD WOOD', 'CANCEL'].map(label => (
                      <button 
                        key={label}
                        onClick={() => handleCrisisClick(label)}
                        className="bg-slate-400 text-white p-3 rounded shadow active:scale-95"
                      >
                          {label}
                      </button>
                  ))}
              </div>
              {crisisFeedback && (
                  <div className="text-red-500 font-bold animate-bounce bg-white px-4 py-2 rounded-lg shadow">
                      {crisisFeedback}
                  </div>
              )}
          </div>
      )
  }

  if (mode === 'HIERARCHY_FIX') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-6 text-center">Design the Panel</h3>
                  
                  <div className="space-y-4">
                      {/* Ignite Slot */}
                      <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-red-500">IGNITE (Primary)</span>
                          <div className="flex gap-2">
                              {['SOLID', 'OUTLINED', 'TEXT'].map(style => (
                                  <button 
                                    key={style}
                                    onClick={() => handleAssign(style, 'ignite')}
                                    className={`w-8 h-8 rounded text-[10px] border flex items-center justify-center ${assignments.ignite === style ? 'bg-red-500 text-white border-red-600' : 'bg-slate-100'}`}
                                  >
                                      {style[0]}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Wood Slot */}
                      <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-blue-500">ADD WOOD (Secondary)</span>
                          <div className="flex gap-2">
                              {['SOLID', 'OUTLINED', 'TEXT'].map(style => (
                                  <button 
                                    key={style}
                                    onClick={() => handleAssign(style, 'wood')}
                                    className={`w-8 h-8 rounded text-[10px] border flex items-center justify-center ${assignments.wood === style ? 'bg-blue-500 text-white border-blue-600' : 'bg-slate-100'}`}
                                  >
                                      {style[0]}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Cancel Slot */}
                      <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-500">CANCEL (Tertiary)</span>
                          <div className="flex gap-2">
                              {['SOLID', 'OUTLINED', 'TEXT'].map(style => (
                                  <button 
                                    key={style}
                                    onClick={() => handleAssign(style, 'cancel')}
                                    className={`w-8 h-8 rounded text-[10px] border flex items-center justify-center ${assignments.cancel === style ? 'bg-slate-500 text-white border-slate-600' : 'bg-slate-100'}`}
                                  >
                                      {style[0]}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-around items-center h-20">
                      {assignments.cancel === 'TEXT' && <button className="text-slate-500 font-bold text-sm px-2">Cancel</button>}
                      {assignments.wood === 'OUTLINED' && <button className="border-2 border-blue-500 text-blue-600 font-bold text-sm px-3 py-1 rounded">Add Wood</button>}
                      {assignments.ignite === 'SOLID' && <button className="bg-red-500 text-white font-bold text-sm px-4 py-2 rounded shadow-md">IGNITE</button>}
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'ENABLED_LOGIC') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="relative">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ${isFireLit ? 'bg-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.6)]' : 'bg-slate-800'}`}>
                      {isFireLit ? <Flame size={60} className="text-yellow-200 animate-pulse" /> : <div className="text-slate-600 text-xs">No Fire</div>}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-mono border border-slate-600">
                      Wood: {woodCount}
                  </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-xs">
                  <button 
                    onClick={() => setWoodCount(c => c + 1)}
                    className="border-2 border-slate-400 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                      <Plus size={18} /> Add Wood
                  </button>

                  <button 
                    onClick={handleIgnite}
                    disabled={woodCount === 0}
                    className={`
                        font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all
                        ${woodCount > 0 
                            ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95 cursor-pointer' 
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'}
                    `}
                  >
                      <Flame size={18} /> IGNITE
                  </button>
                  
                  {woodCount === 0 && <div className="text-xs text-center text-red-400 font-bold">Enabled = False</div>}
                  {woodCount > 0 && <div className="text-xs text-center text-green-500 font-bold">Enabled = True</div>}
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'TEXT';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-red-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-100 p-2 rounded-full"><HelpCircle className="text-red-600" /></div>
                    <h3 className="text-xl font-bold text-red-900">视觉层级测验</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    在确认对话框中，“取消”按钮通常应该使用哪种样式？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'SOLID', label: 'Button (实心)' },
                        { val: 'OUTLINED', label: 'OutlinedButton (边框)' },
                        { val: 'TEXT', label: 'TextButton (文字)' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'TEXT';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-700";
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
            <div className="bg-[#FEF2F2] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-red-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：状态驱动
                    </h3>
                    <div className="bg-red-100 p-4 rounded-lg border border-red-300 mb-4 font-mono text-sm text-red-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-red-300 text-red-900 focus:border-red-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Correct!</p>}
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
                    <p className="text-blue-200 text-sm font-mono"><span className="text-red-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-500">
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

export default InteractiveButtonLab;