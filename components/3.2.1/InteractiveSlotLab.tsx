
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, LayoutTemplate, XCircle, Image as ImageIcon, Type, MousePointer2, HelpCircle, Edit3, Terminal, Sparkles, Box, Utensils } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveSlotLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: RIGID BENTO ===
  const [rigidError, setRigidError] = useState("");

  // === LAB 2: SLOT BENTO ===
  const [topSlotContent, setTopSlotContent] = useState<string | null>(null);
  const [bottomSlotContent, setBottomSlotContent] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<'TOP' | 'BOTTOM' | null>(null);

  // === LAB 3: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 4: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 5: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("@Composable\nfun CustomButton(content: @Composable RowScope.() -> Unit) {\n  Row {\n    content()\n  }\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: RIGID BENTO ---
  const handleRigidDrop = () => {
      setRigidError("Type Mismatch: Expected String, found Image");
      setTimeout(onComplete, 2000); // Fail forward
  };

  // --- LOGIC: SLOT BENTO ---
  const handleSlotSelect = (content: string) => {
      if (activeSlot === 'TOP') setTopSlotContent(content);
      if (activeSlot === 'BOTTOM') setBottomSlotContent(content);
      setActiveSlot(null);
  };

  useEffect(() => {
      if (topSlotContent && bottomSlotContent) {
          setTimeout(onComplete, 1500);
      }
  }, [topSlotContent, bottomSlotContent, onComplete]);


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'TRAILING') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'PARENS': return { correct: false, text: "错误。虽然可以写在圆括号里，但这不是 Kotlin 的惯用风格。" };
          case 'INLINE': return { correct: false, text: "错误。inline 是关键字，不是调用语法。" };
          case 'TRAILING': return { correct: true, text: "正确！如果 Lambda 是最后一个参数，可以移到圆括号外面。这让 Compose 看起来像层级结构。" };
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
                Check if it takes a composable lambda 'content' and uses 'Row'.
                Respond JSON: { "pass": boolean, "message": "string (Rin persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          setAiFeedback({ pass: false, msg: "AI 离线中，模拟通过！" });
          setTimeout(onComplete, 2000);
      } finally {
          setAiLoading(false);
      }
  };

  // === RENDERERS ===

  if (mode === 'RIGID_BENTO') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              {/* Code Def */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-xl font-mono text-sm text-slate-300">
                  <span className="text-purple-400">fun</span> RigidBento(rice: <span className="text-yellow-400">String</span>)
              </div>

              <div className="flex gap-8 items-center">
                  {/* The Box */}
                  <div className="w-40 h-40 border-4 border-dashed border-slate-400 rounded-2xl flex items-center justify-center bg-white/50 relative">
                      <span className="text-slate-400 font-bold">String Only</span>
                      
                      {rigidError && (
                          <div className="absolute inset-0 bg-red-100/90 backdrop-blur-sm flex flex-col items-center justify-center p-2 rounded-xl border-2 border-red-500 animate-shake">
                              <XCircle className="text-red-500 mb-2" size={32} />
                              <span className="text-xs text-red-700 font-mono font-bold text-center">{rigidError}</span>
                          </div>
                      )}
                  </div>

                  {/* The Item */}
                  <button onClick={handleRigidDrop} className="w-24 h-24 bg-white rounded-xl shadow-lg border-2 border-purple-200 flex flex-col items-center justify-center gap-2 hover:scale-110 transition-transform cursor-pointer">
                      <ImageIcon className="text-purple-500" size={32} />
                      <span className="text-xs font-bold text-slate-600">Image</span>
                  </button>
              </div>
              <div className="text-slate-500 text-sm animate-pulse">点击 Image 放入盒子</div>
          </div>
      )
  }

  if (mode === 'SLOT_BENTO') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <h3 className="text-purple-900 font-bold text-xl flex items-center gap-2">
                  <Utensils /> Custom Bento Builder
              </h3>

              <div className="flex gap-8 w-full max-w-4xl justify-center items-start">
                  
                  {/* The Bento Box (Slots) */}
                  <div className="w-64 bg-purple-50 rounded-[2rem] border-4 border-purple-200 p-4 flex flex-col gap-4 shadow-xl">
                      {/* Top Slot */}
                      <button 
                        onClick={() => setActiveSlot('TOP')}
                        className={`h-24 w-full rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${activeSlot === 'TOP' ? 'border-purple-500 bg-purple-100 animate-pulse' : 'border-slate-300 bg-white/50 hover:border-purple-300'}`}
                      >
                          {topSlotContent ? (
                              <div className="flex flex-col items-center text-purple-700">
                                  {topSlotContent === 'Rice' && <div className="text-2xl">🍚</div>}
                                  {topSlotContent === 'Noodles' && <div className="text-2xl">🍜</div>}
                                  <span className="font-bold">{topSlotContent}</span>
                              </div>
                          ) : <span className="text-slate-400 font-mono text-xs">Slot: Main</span>}
                      </button>

                      {/* Bottom Slot */}
                      <button 
                        onClick={() => setActiveSlot('BOTTOM')}
                        className={`h-24 w-full rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${activeSlot === 'BOTTOM' ? 'border-purple-500 bg-purple-100 animate-pulse' : 'border-slate-300 bg-white/50 hover:border-purple-300'}`}
                      >
                          {bottomSlotContent ? (
                              <div className="flex flex-col items-center text-purple-700">
                                  {bottomSlotContent === 'Salad' && <div className="text-2xl">🥗</div>}
                                  {bottomSlotContent === 'Fruit' && <div className="text-2xl">🍎</div>}
                                  <span className="font-bold">{bottomSlotContent}</span>
                              </div>
                          ) : <span className="text-slate-400 font-mono text-xs">Slot: Side</span>}
                      </button>
                  </div>

                  {/* Component Palette */}
                  {activeSlot && (
                      <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 w-48 animate-fade-in-right">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Component</h4>
                          <div className="grid grid-cols-2 gap-2">
                              {['Rice', 'Noodles', 'Salad', 'Fruit'].map(item => (
                                  <button 
                                    key={item}
                                    onClick={() => handleSlotSelect(item)}
                                    className="p-3 bg-slate-50 hover:bg-purple-100 rounded-lg border border-slate-100 transition-colors flex flex-col items-center gap-1"
                                  >
                                      <Box size={16} className="text-slate-500"/>
                                      <span className="text-xs font-bold text-slate-700">{item}</span>
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'TRAILING';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-purple-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2 rounded-full"><HelpCircle className="text-purple-600" /></div>
                    <h3 className="text-xl font-bold text-purple-900">语法测验</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    如果函数的最后一个参数是 Lambda (插槽)，我们可以使用什么特殊的语法来调用它？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'PARENS', label: 'Card(content = { ... })' },
                        { val: 'INLINE', label: 'Card inline { ... }' },
                        { val: 'TRAILING', label: 'Card { ... } (尾随 Lambda)' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'TRAILING';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-purple-400 hover:bg-purple-50 text-slate-700";
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
            <div className="bg-[#FAF5FF] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-purple-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：定义 Slot
                    </h3>
                    <div className="bg-purple-100 p-4 rounded-lg border border-purple-300 mb-4 font-mono text-sm text-purple-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-purple-300 text-purple-900 focus:border-purple-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Slot Defined!</p>}
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
                    <p className="text-blue-200 text-sm font-mono"><span className="text-purple-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-500">
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

export default InteractiveSlotLab;
