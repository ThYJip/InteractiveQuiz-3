
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Zap, AlertTriangle, CheckCircle2, User, Play, Monitor, Box, Terminal, Edit3, Sparkles, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveEventLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: COUPLED CRASH ===
  const [showError, setShowError] = useState(false);

  // === LAB 2: RELAY SUCCESS ===
  const [realScore, setRealScore] = useState(0);
  const [previewLog, setPreviewLog] = useState("");
  const [successCount, setSuccessCount] = useState(0);

  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === AI ===
  const [userCode, setUserCode] = useState("@Composable\nfun LoginButton(vm: LoginViewModel) {\n  Button(onClick = { vm.login() }) { Text(\"Login\") }\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: COUPLED CRASH ---
  const handleTryPreview = () => {
      setShowError(true);
      setTimeout(() => {
          onComplete(); // Fail forward to explanation
      }, 2500);
  };

  // --- LOGIC: RELAY SUCCESS ---
  const handleRealClick = () => {
      setRealScore(s => s + 1);
      checkSuccess();
  };

  const handlePreviewClick = () => {
      setPreviewLog("Event received! (Dummy)");
      setTimeout(() => setPreviewLog(""), 1000);
      checkSuccess();
  };

  const checkSuccess = () => {
      setSuccessCount(c => {
          const next = c + 1;
          if (next >= 3) {
              setTimeout(onComplete, 1500);
          }
          return next;
      });
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
          case 'PERFORMANCE': return { correct: false, text: "错误。传递 Lambda 和传递对象引用在性能上差异微乎其微。" };
          case 'DECOUPLE': return { correct: true, text: "正确！解耦是关键。这样 UI 组件就不依赖具体的 ViewModel，可以在 Preview、测试或其他页面中复用。" };
          case 'SYNTAX': return { correct: false, text: "错误。虽然是 Kotlin 特性，但这不仅是语法糖，更是架构原则。" };
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
                Check if the function signature uses a lambda (e.g. onClick: () -> Unit) instead of ViewModel.
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

  if (mode === 'COUPLED_CRASH') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-600 font-mono text-sm text-slate-300 w-full max-w-md">
                  <span className="text-pink-400">@Composable</span><br/>
                  <span className="text-blue-400">fun</span> Runner(vm: <span className="text-red-400 font-bold">RaceViewModel</span>) &#123;<br/>
                  &nbsp;&nbsp;Button(onClick = &#123; vm.run() &#125;) ...<br/>
                  &#125;
              </div>

              <div className="relative w-full max-w-md h-40 border-4 border-dashed border-slate-400 rounded-2xl flex items-center justify-center bg-slate-100 overflow-hidden">
                  {!showError ? (
                      <div className="text-slate-400 font-bold flex flex-col items-center gap-2">
                          <Monitor size={32} />
                          <span>@Preview Area</span>
                      </div>
                  ) : (
                      <div className="absolute inset-0 bg-red-100 flex flex-col items-center justify-center p-4 text-center animate-shake">
                          <AlertTriangle className="text-red-600 mb-2" size={40} />
                          <h3 className="text-red-800 font-bold">PREVIEW CRASHED</h3>
                          <p className="text-red-600 text-xs">java.lang.IllegalStateException: Cannot create instance of RaceViewModel in Preview.</p>
                      </div>
                  )}
              </div>

              <button 
                onClick={handleTryPreview}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-500 active:scale-95 transition-all"
              >
                  Try to Render Preview
              </button>
          </div>
      )
  }

  if (mode === 'RELAY_SUCCESS') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <div className="bg-slate-800 px-4 py-2 rounded-lg font-mono text-sm text-green-400 border border-slate-600">
                  fun Runner(onRun: () -&gt; Unit)
              </div>

              <div className="flex gap-4 w-full max-w-4xl h-64">
                  {/* REAL APP CONTEXT */}
                  <div className="flex-1 bg-white rounded-2xl shadow-xl border-4 border-blue-100 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-br-xl text-xs font-bold">REAL APP</div>
                      
                      <div className="mb-4 text-center">
                          <div className="text-xs text-slate-400 font-bold mb-1">ViewModel State</div>
                          <div className="text-3xl font-black text-blue-600">{realScore}</div>
                      </div>

                      <button 
                        onClick={handleRealClick}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-bold shadow-md active:scale-95 transition-transform flex items-center gap-2"
                      >
                          <Play size={16} /> Run (Real)
                      </button>
                  </div>

                  {/* PREVIEW CONTEXT */}
                  <div className="flex-1 bg-slate-100 rounded-2xl border-4 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 bg-slate-300 text-slate-700 px-3 py-1 rounded-br-xl text-xs font-bold">@PREVIEW</div>
                      
                      <div className="mb-4 text-center h-10 flex items-center justify-center">
                          {previewLog ? (
                              <span className="text-green-600 font-bold animate-fade-in">{previewLog}</span>
                          ) : (
                              <span className="text-slate-400 text-xs italic">// Empty Lambda {}</span>
                          )}
                      </div>

                      <button 
                        onClick={handlePreviewClick}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-bold shadow-md active:scale-95 transition-transform flex items-center gap-2"
                      >
                          <Play size={16} /> Run (Dummy)
                      </button>
                  </div>
              </div>
              <p className="text-slate-500 text-sm font-bold animate-pulse">
                  点击两边的按钮。同一个组件，不同的上下文！
              </p>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'DECOUPLE';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-red-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-100 p-2 rounded-full"><HelpCircle className="text-red-600" /></div>
                    <h3 className="text-xl font-bold text-red-900">架构选择题</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    为什么推荐使用 `onEvent: () -> Unit` (事件提升) 而不是直接传 ViewModel？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'PERFORMANCE', label: '为了提高运行时性能' },
                        { val: 'DECOUPLE', label: '为了解耦 UI 和逻辑，方便测试和复用' },
                        { val: 'SYNTAX', label: '因为这是 Kotlin 的语法要求' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'DECOUPLE';
                        
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
                        <Edit3 size={24} /> 露营笔记：函数引用
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
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Referenced!</p>}
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
                    <p className="text-red-200 text-sm font-mono"><span className="text-red-400">#</span> {config.assignmentPrompt}</p>
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

export default InteractiveEventLab;
