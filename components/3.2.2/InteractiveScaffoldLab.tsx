
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Layout, ArrowUp, ArrowDown, HelpCircle, Edit3, Terminal, Sparkles, Box, Hammer, Maximize, Plus } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveScaffoldLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: MANUAL CHAOS ===
  const [contentSize, setContentSize] = useState(100);
  const [isChaosFixed, setIsChaosFixed] = useState(false); // Just a simulation state

  // === LAB 2: SCAFFOLD DEMO ===
  const [filledSlots, setFilledSlots] = useState<{top: boolean, bottom: boolean, fab: boolean}>({top: false, bottom: false, fab: false});

  // === LAB 3: PADDING TRAP ===
  const [paddingApplied, setPaddingApplied] = useState(false);

  // === LAB 4: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 5: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 6: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("Scaffold(\n  topBar = { ... },\n  floatingActionButton = { ... }\n) { \n  Text(\"Hello\") \n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: MANUAL CHAOS ---
  // Simulation: Just showing overlaps visually. No real logic needed to proceed immediately, 
  // maybe wait for user to drag slider.
  useEffect(() => {
      if (mode === 'MANUAL_CHAOS' && contentSize > 150) {
          setTimeout(onComplete, 2000);
      }
  }, [contentSize, mode, onComplete]);


  // --- LOGIC: SCAFFOLD DEMO ---
  const toggleSlot = (slot: 'top' | 'bottom' | 'fab') => {
      setFilledSlots(prev => {
          const next = { ...prev, [slot]: !prev[slot] };
          if (next.top && next.bottom && next.fab) {
              setTimeout(onComplete, 1500);
          }
          return next;
      });
  };

  // --- LOGIC: PADDING TRAP ---
  const togglePadding = () => {
      setPaddingApplied(prev => !prev);
      if (!paddingApplied) { // If turning ON
          setTimeout(onComplete, 2000);
      }
  };


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'SAFE_AREA') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'MARGIN': return { correct: false, text: "错误。PaddingValues 不是 Margin。Margin 是外部间距，这里我们需要的是内部避让距离。" };
          case 'COLOR': return { correct: false, text: "错误。PaddingValues 只包含尺寸信息（top, bottom 等），不包含颜色。" };
          case 'SAFE_AREA': return { correct: true, text: "正确！它代表了被 Scaffold 的其他部件（如 TopBar/BottomBar）占据的区域，即你需要避让的“非安全区域”。" };
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
                Check if it uses Scaffold, has a FAB, and applies padding (innerPadding/PaddingValues) to the content.
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

  if (mode === 'MANUAL_CHAOS') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <div className="bg-white/80 px-6 py-2 rounded-full font-bold text-blue-900 border border-blue-200">
                  手动 Box 布局：拖动滑块增加内容高度
              </div>
              
              <div className="relative w-64 h-96 border-4 border-slate-800 rounded-3xl bg-white overflow-hidden shadow-2xl">
                  {/* Content (Z-Index 0) */}
                  <div 
                    className="absolute top-0 left-0 w-full bg-blue-100 p-4 transition-all duration-300"
                    style={{ height: `${contentSize}%` }}
                  >
                      <div className="space-y-2">
                          {[...Array(10)].map((_, i) => (
                              <div key={i} className="h-4 bg-blue-200 rounded w-full"></div>
                          ))}
                      </div>
                  </div>

                  {/* Top Bar (Z-Index 10) - Overlaps content */}
                  <div className="absolute top-0 left-0 w-full h-14 bg-slate-800/80 backdrop-blur text-white flex items-center justify-center font-bold z-10 border-b border-white/20">
                      Top Bar
                  </div>

                  {/* Bottom Bar (Z-Index 10) - Overlaps content */}
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-slate-800/80 backdrop-blur text-white flex items-center justify-center font-bold z-10 border-t border-white/20">
                      Bottom Bar
                  </div>
              </div>

              <input 
                type="range" min="50" max="200" 
                value={contentSize} 
                onChange={(e) => setContentSize(parseInt(e.target.value))}
                className="w-64 accent-blue-600"
              />
              <p className="text-xs text-red-500 font-bold animate-pulse">
                  {contentSize > 100 ? "⚠️ 内容被遮挡了！" : "看起来还行..."}
              </p>
          </div>
      )
  }

  if (mode === 'SCAFFOLD_DEMO') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <h3 className="text-blue-900 font-bold text-xl flex items-center gap-2">
                  <Hammer /> Build Your Scaffold
              </h3>

              <div className="flex gap-12 items-center">
                  {/* The Skeleton */}
                  <div className="w-64 h-96 border-4 border-dashed border-blue-300 rounded-3xl relative bg-blue-50">
                      {/* Slots */}
                      <button 
                        onClick={() => toggleSlot('top')}
                        className={`absolute top-0 left-0 w-full h-14 border-b-2 border-dashed border-blue-300 flex items-center justify-center transition-all z-10 ${filledSlots.top ? 'bg-slate-800 text-white border-solid' : 'bg-white/50 text-blue-300 hover:bg-blue-100'}`}
                      >
                          {filledSlots.top ? "TopAppBar" : "+ Top Bar"}
                      </button>

                      <div className="absolute inset-0 pt-14 pb-16 flex items-center justify-center">
                          <span className="text-blue-200 font-black text-4xl rotate-45 opacity-50">CONTENT</span>
                      </div>

                      <button 
                        onClick={() => toggleSlot('fab')}
                        className={`absolute bottom-20 right-4 w-12 h-12 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center transition-all shadow-sm z-10 ${filledSlots.fab ? 'bg-blue-500 text-white border-solid scale-110' : 'bg-white/50 text-blue-300 hover:bg-blue-100'}`}
                      >
                          {filledSlots.fab ? <Plus /> : "+"}
                      </button>

                      <button 
                        onClick={() => toggleSlot('bottom')}
                        className={`absolute bottom-0 left-0 w-full h-16 border-t-2 border-dashed border-blue-300 flex items-center justify-center transition-all z-10 ${filledSlots.bottom ? 'bg-slate-800 text-white border-solid' : 'bg-white/50 text-blue-300 hover:bg-blue-100'}`}
                      >
                          {filledSlots.bottom ? "BottomAppBar" : "+ Bottom Bar"}
                      </button>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-4 h-4 bg-slate-800 rounded"></div> Components
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-4 h-4 border-2 border-dashed border-blue-300 bg-blue-50 rounded"></div> Slots
                      </div>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'PADDING_TRAP') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                  <span className="text-sm font-bold text-slate-700">Apply Padding?</span>
                  <button 
                    onClick={togglePadding}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${paddingApplied ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${paddingApplied ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
              </div>

              <div className="relative w-64 h-96 border-8 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white">
                  {/* Top Bar (Fixed) */}
                  <div className="absolute top-0 left-0 w-full h-14 bg-slate-800 z-20 shadow-md flex items-center justify-center text-white text-xs font-bold">Top Bar (h=56dp)</div>
                  
                  {/* Content List */}
                  <div 
                    className="w-full h-full overflow-y-auto bg-slate-50 transition-all duration-500"
                    style={{ 
                        paddingTop: paddingApplied ? '56px' : '0px', 
                        paddingBottom: paddingApplied ? '64px' : '0px' 
                    }}
                  >
                      <div className={`p-4 bg-red-100 mb-2 border border-red-300 text-red-800 text-xs font-bold flex items-center justify-between ${!paddingApplied ? 'opacity-50' : ''}`}>
                          <span>Item #1 (Top)</span>
                          {!paddingApplied && <span className="text-[10px] bg-red-200 px-1 rounded">HIDDEN!</span>}
                      </div>
                      {[...Array(6)].map((_, i) => (
                          <div key={i} className="p-4 bg-white mb-2 border border-slate-100 text-slate-600 text-xs">
                              Item #{i + 2}
                          </div>
                      ))}
                      <div className={`p-4 bg-red-100 mb-2 border border-red-300 text-red-800 text-xs font-bold flex items-center justify-between ${!paddingApplied ? 'opacity-50' : ''}`}>
                          <span>Item #Last (Bottom)</span>
                          {!paddingApplied && <span className="text-[10px] bg-red-200 px-1 rounded">HIDDEN!</span>}
                      </div>
                  </div>

                  {/* Bottom Bar (Fixed) */}
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-slate-800 z-20 shadow-md-top flex items-center justify-center text-white text-xs font-bold">Bottom Bar (h=64dp)</div>
              </div>
              
              {!paddingApplied && (
                  <div className="text-red-500 font-bold text-sm animate-bounce flex items-center gap-2">
                      <ArrowUp size={16} /> Content Overlap! <ArrowDown size={16} />
                  </div>
              )}
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'SAFE_AREA';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-blue-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-full"><HelpCircle className="text-blue-600" /></div>
                    <h3 className="text-xl font-bold text-blue-900">PaddingValues 是什么？</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    Scaffold 传回的 `innerPadding` 到底代表了什么？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'MARGIN', label: '外部间距 (Margin)' },
                        { val: 'COLOR', label: '背景颜色信息' },
                        { val: 'SAFE_AREA', label: '安全区域 / 避让距离' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'SAFE_AREA';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700";
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
            <div className="bg-[#EFF6FF] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-blue-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：遵守契约
                    </h3>
                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-300 mb-4 font-mono text-sm text-blue-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-blue-300 text-blue-900 focus:border-blue-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Contract Accepted!</p>}
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
                    <p className="text-blue-200 text-sm font-mono"><span className="text-blue-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-500">
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

export default InteractiveScaffoldLab;
