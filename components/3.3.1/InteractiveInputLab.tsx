
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, PenTool, RefreshCw, Eye, EyeOff, Search, HelpCircle, Edit3, Terminal, Sparkles, Mail, Send, Type, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveInputLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: BROKEN PEN ===
  const [brokenText, setBrokenText] = useState("");
  const [attemptedInput, setAttemptedInput] = useState("");
  const [brokenAttempts, setBrokenAttempts] = useState(0);

  // === LAB 2: UDF LOOP ===
  const [udfStep, setUdfStep] = useState(0); // 0: Idle, 1: Typing, 2: Event, 3: State Update, 4: UI Update
  const [udfText, setUdfText] = useState("Hello");

  // === LAB 3: DECORATION ===
  const [decoConfig, setDecoConfig] = useState({ label: false, icon: false, password: false });
  const [decoText, setDecoText] = useState("");

  // === LAB 4: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 5: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 6: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("val text by remember { mutableStateOf(\"\") }\nTextField(\n  value = text,\n  onValueChange = { text = it }\n)");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);

  // === LAB 7: FINAL PROJECT ===
  const [projectStep, setProjectStep] = useState(0);
  const [projectInputs, setProjectInputs] = useState(["", "", ""]);
  
  const projectStepsInfo = [
      {
          title: "Step 1: 定义状态",
          desc: "使用 `remember` 和 `mutableStateOf` 定义 `to` (收件人) 和 `body` (正文) 两个状态。",
          placeholder: "val to by remember { ... }\nval body by remember { ... }"
      },
      {
          title: "Step 2: 收件人输入框",
          desc: "创建一个 `TextField` 绑定 `to` 状态。添加 `label` 为 'To'。",
          placeholder: "TextField(value = to, onValueChange = { to = it }, label = { Text(\"To\") })"
      },
      {
          title: "Step 3: 正文输入框",
          desc: "创建一个 `TextField` 绑定 `body` 状态。这是多行文本，不需要特别配置，默认即可。",
          placeholder: "TextField(value = body, onValueChange = { body = it })"
      }
  ];


  // --- LOGIC: BROKEN PEN ---
  const handleBrokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Intentionally NOT updating state
      setAttemptedInput(e.target.value);
      setBrokenAttempts(prev => prev + 1);
      if (brokenAttempts >= 3) {
          setTimeout(onComplete, 1500);
      }
  };

  // --- LOGIC: UDF LOOP ---
  const advanceUdf = () => {
      setUdfStep(prev => {
          const next = prev + 1;
          if (next > 4) {
              setTimeout(onComplete, 1000);
              return 0; // Reset or finish
          }
          return next;
      });
  };

  // --- LOGIC: DECORATION ---
  const toggleDeco = (key: 'label' | 'icon' | 'password') => {
      setDecoConfig(prev => {
          const next = { ...prev, [key]: !prev[key] };
          if (next.label && next.icon && next.password) {
              setTimeout(onComplete, 2000);
          }
          return next;
      });
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'NEW_VALUE') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'DELTA': return { correct: false, text: "错误。Compose 不会告诉你'刚刚输入了什么字符'，而是给你完整的新字符串。" };
          case 'OLD_VALUE': return { correct: false, text: "错误。如果是旧值，那就没变化了。" };
          case 'NEW_VALUE': return { correct: true, text: "正确！它代表了'如果这次修改生效，输入框应该显示的完整文本'。" };
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
                Check for remember, mutableStateOf, value, and onValueChange.
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

  // --- LOGIC: FINAL PROJECT ---
  const checkProjectStepWithAI = async () => {
    setAiLoading(true);
    setAiFeedback(null);
    const currentInfo = projectStepsInfo[projectStep];
    const code = projectInputs[projectStep];

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: `
              You are Rin Shima. 
              Step: ${currentInfo.title}.
              Task Description: ${currentInfo.desc}.
              User Code: "${code}".
              
              Verify if the code correctly implements the requirement for this step.
              Step 1 Req: remember and mutableStateOf for 'to' and 'body'.
              Step 2 Req: TextField binding 'to' and label.
              Step 3 Req: TextField binding 'body'.

              Respond JSON: { "pass": boolean, "message": "string (Short feedback in Chinese)" }.
           `,
           config: { responseMimeType: "application/json" }
        });
        const result = JSON.parse(response.text || "{}");
        setAiFeedback({ pass: result.pass, msg: result.message });
        
        if (result.pass) {
            setTimeout(() => {
                if (projectStep < 2) {
                    setProjectStep(prev => prev + 1);
                    setAiFeedback(null);
                } else {
                    setProjectStep(3); // Complete
                    onComplete(); 
                }
            }, 2000);
        }
    } catch (error) {
        console.error(error);
        setAiFeedback({ pass: false, msg: "AI 繁忙，模拟通过！" });
        setTimeout(() => {
          if (projectStep < 2) {
              setProjectStep(prev => prev + 1);
              setAiFeedback(null);
          } else {
              setProjectStep(3);
              onComplete();
          }
        }, 1500);
    } finally {
        setAiLoading(false);
    }
};

  // === RENDERERS ===

  if (mode === 'BROKEN_PEN') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-pink-200 w-full max-w-md text-center">
                  <h3 className="text-pink-800 font-bold mb-4">The Frozen TextField</h3>
                  <div className="relative">
                      <input 
                        type="text" 
                        value="Hello" 
                        onChange={handleBrokenInput}
                        className="w-full border-2 border-slate-300 rounded-lg p-3 text-lg font-mono text-slate-500 bg-slate-100 outline-none focus:border-pink-400"
                      />
                      {/* Simulation of cursor blocked */}
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-red-500 font-bold text-xs animate-pulse">
                          {brokenAttempts > 0 ? "Blocked!" : ""}
                      </div>
                  </div>
                  <div className="mt-4 text-xs font-mono text-left bg-slate-800 text-green-400 p-3 rounded">
                      <div>Current State: "Hello"</div>
                      <div className="text-red-400">Attempted Input: "{attemptedInput}"</div>
                      <div className="text-slate-400">// onValueChange ignored!</div>
                  </div>
              </div>
              <p className="text-pink-700 font-bold animate-bounce">
                  {brokenAttempts >= 3 ? "点不动吧？因为 State 没有更新！" : "试着修改上面的文字..."}
              </p>
          </div>
      )
  }

  if (mode === 'UDF_LOOP') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <h3 className="text-pink-900 font-bold text-xl flex items-center gap-2">
                  <RefreshCw /> The UDF Cycle
              </h3>

              <div className="relative w-[300px] h-[300px] bg-white rounded-full shadow-2xl border-4 border-pink-100 flex items-center justify-center">
                  
                  {/* Step 1: Input */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-xl border-2 shadow-lg transition-all ${udfStep === 1 ? 'border-pink-500 scale-110' : 'border-slate-200 opacity-50'}`}>
                      <div className="text-xs font-bold text-slate-500">1. User types '!'</div>
                  </div>

                  {/* Step 2: Event */}
                  <div className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-xl border-2 shadow-lg transition-all ${udfStep === 2 ? 'border-pink-500 scale-110' : 'border-slate-200 opacity-50'}`}>
                      <div className="text-xs font-bold text-slate-500">2. onValueChange("Hello!")</div>
                  </div>

                  {/* Step 3: State */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white p-3 rounded-xl border-2 shadow-lg transition-all ${udfStep === 3 ? 'border-pink-500 scale-110' : 'border-slate-200 opacity-50'}`}>
                      <div className="text-xs font-bold text-slate-500">3. textState = "Hello!"</div>
                  </div>

                  {/* Step 4: UI */}
                  <div className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-xl border-2 shadow-lg transition-all ${udfStep === 4 ? 'border-pink-500 scale-110' : 'border-slate-200 opacity-50'}`}>
                      <div className="text-xs font-bold text-slate-500">4. Recompose UI</div>
                  </div>

                  {/* Center Display */}
                  <div className="text-center">
                      <div className="text-4xl font-mono text-pink-600 font-bold mb-2">
                          {udfStep >= 3 ? "Hello!" : "Hello"}
                      </div>
                      <div className="text-xs text-slate-400">Current Display</div>
                  </div>
              </div>

              <button 
                onClick={advanceUdf}
                className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-transform active:scale-95"
              >
                  {udfStep === 0 ? "Start Typing" : udfStep === 4 ? "Done" : "Next Step"}
              </button>
          </div>
      )
  }

  if (mode === 'DECORATION') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-pink-100 w-full max-w-sm">
                  <div className="relative border-2 border-slate-300 rounded-lg flex items-center p-3 gap-2 bg-slate-50 focus-within:border-pink-500 focus-within:ring-2 ring-pink-100 transition-all">
                      {decoConfig.icon && <Search className="text-slate-400" size={20} />}
                      <div className="flex-1">
                          {decoConfig.label && (
                              <div className="text-[10px] text-pink-500 font-bold mb-0.5">Search Query</div>
                          )}
                          <input 
                            type={decoConfig.password ? "password" : "text"}
                            value={decoText}
                            onChange={(e) => setDecoText(e.target.value)}
                            placeholder={!decoConfig.label ? "Type here..." : ""}
                            className="w-full bg-transparent outline-none text-slate-700 font-medium"
                          />
                      </div>
                      {decoConfig.password && (
                          <button className="text-slate-400 hover:text-slate-600">
                              <EyeOff size={18} />
                          </button>
                      )}
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                  <button 
                    onClick={() => toggleDeco('label')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${decoConfig.label ? 'bg-pink-100 border-pink-400 text-pink-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                      <Type size={20} />
                      <span className="text-xs font-bold">Label</span>
                  </button>
                  <button 
                    onClick={() => toggleDeco('icon')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${decoConfig.icon ? 'bg-pink-100 border-pink-400 text-pink-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                      <Search size={20} />
                      <span className="text-xs font-bold">Icon</span>
                  </button>
                  <button 
                    onClick={() => toggleDeco('password')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${decoConfig.password ? 'bg-pink-100 border-pink-400 text-pink-700' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                      <Eye size={20} />
                      <span className="text-xs font-bold">Password</span>
                  </button>
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'NEW_VALUE';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-pink-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-pink-100 p-2 rounded-full"><HelpCircle className="text-pink-600" /></div>
                    <h3 className="text-xl font-bold text-pink-900">参数含义</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    `onValueChange: (String) -> Unit` 中的 String 参数代表什么？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'DELTA', label: '刚刚输入的单个字符 (Delta)' },
                        { val: 'OLD_VALUE', label: '修改前的旧文本' },
                        { val: 'NEW_VALUE', label: '修改后的完整新文本' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'NEW_VALUE';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-pink-400 hover:bg-pink-50 text-slate-700";
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
            <div className="bg-[#FFF1F2] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-pink-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-pink-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：标准写法
                    </h3>
                    <div className="bg-pink-100 p-4 rounded-lg border border-pink-300 mb-4 font-mono text-sm text-pink-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-pink-300 text-pink-900 focus:border-pink-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Synced!</p>}
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
                    <p className="text-blue-200 text-sm font-mono"><span className="text-pink-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-pink-500">
                            {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} 提交
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
  }

  if (mode === 'FINAL_PROJECT') {
    if (projectStep === 3) {
        // SUCCESS SPLIT VIEW
        return (
            <div className="w-full h-full relative">
                {/* Content Container with blur/opacity effect to emphasize the overlay initially */}
                <div className="w-full h-full flex items-stretch gap-4 p-2 transition-all duration-1000 opacity-40 hover:opacity-100 hover:blur-0 blur-[2px]">
                    {/* LEFT: FULL CODE */}
                    <div className="flex-1 bg-[#1e293b] rounded-2xl border-4 border-pink-500 overflow-hidden flex flex-col shadow-2xl">
                        <div className="bg-[#0f172a] p-3 text-pink-300 font-bold font-mono text-sm flex items-center gap-2">
                            <PenTool size={16}/> Postcard.kt
                        </div>
                        <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                            <pre className="font-mono text-xs text-blue-200 whitespace-pre-wrap leading-relaxed">
{`@Composable
fun PostcardEditor() {
    // 1. State
    var to by remember { mutableStateOf("") }
    var body by remember { mutableStateOf("") }

    Column(Modifier.padding(16.dp)) {
        // 2. Recipient
        TextField(
            value = to,
            onValueChange = { to = it },
            label = { Text("To") }
        )
        
        Spacer(Modifier.height(8.dp))

        // 3. Body
        TextField(
            value = body,
            onValueChange = { body = it },
            label = { Text("Message") },
            minLines = 3
        )
    }
}`}
                            </pre>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW */}
                    <div className="w-[300px] bg-[#FFF8E1] rounded-xl border-8 border-slate-300 shadow-2xl overflow-hidden flex flex-col relative p-6 font-serif">
                        <div className="absolute top-4 right-4 w-16 h-20 border-2 border-slate-300 flex items-center justify-center text-slate-300 text-xs">
                            STAMP
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-8 underline decoration-pink-300">Postcard</h3>
                        
                        <div className="mb-4">
                            <span className="text-xs text-slate-500 uppercase font-bold">To:</span>
                            <div className="text-lg font-cursive text-slate-800 border-b border-slate-300">
                                {projectInputs[1].split('=').pop()?.replace(/[^\w\s]/gi, 'Chiaki') || "Chiaki"}
                            </div>
                        </div>

                        <div className="flex-1">
                            <span className="text-xs text-slate-500 uppercase font-bold">Message:</span>
                            <div className="text-base text-slate-700 leading-relaxed mt-2 font-cursive">
                                Looking forward to the camping trip! The view here is amazing.
                            </div>
                        </div>
                        
                        <div className="text-right text-sm text-pink-600 font-bold mt-4">
                            - Nadeshiko
                        </div>
                    </div>
                </div>

                {/* OVERLAY INDICATOR */}
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white/95 border-4 border-pink-400 text-pink-600 px-8 py-6 rounded-3xl shadow-2xl animate-bounce flex flex-col items-center gap-2 text-center transform scale-110 pointer-events-auto">
                        <CheckCircle2 size={48} className="text-green-500 mb-2" />
                        <span className="text-2xl font-black tracking-tight">代码构建完成！</span>
                        <span className="text-sm font-bold text-slate-500">请点击右下角的“下一步”继续剧情 👉</span>
                    </div>
                </div>
            </div>
        )
    }

    // STEP INPUT VIEW
    const info = projectStepsInfo[projectStep];
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-slate-700">
                <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2 text-slate-300 font-mono text-sm font-bold">
                        <Terminal size={18} /> Project: Step {projectStep + 1}/3
                    </div>
                    <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`w-20 h-2 rounded-full transition-colors ${i <= projectStep ? 'bg-pink-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 border-b border-slate-700">
                    <h3 className="text-white font-bold text-lg mb-2">{info.title}</h3>
                    <p className="text-blue-200 text-sm font-mono leading-relaxed">
                        <span className="text-pink-400">TODO:</span> {info.desc}
                    </p>
                </div>

                <textarea 
                    value={projectInputs[projectStep]}
                    onChange={(e) => {
                        const val = e.target.value;
                        setProjectInputs(prev => {
                            const next = [...prev];
                            next[projectStep] = val;
                            return next;
                        });
                    }}
                    placeholder={info.placeholder}
                    className="flex-1 bg-[#1e293b] text-slate-100 font-mono text-sm p-4 outline-none resize-none placeholder:text-slate-600"
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
                    <button 
                      onClick={checkProjectStepWithAI} 
                      disabled={aiLoading} 
                      className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-pink-500 disabled:opacity-50"
                    >
                        {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} 
                        {projectStep === 2 ? "完成构建" : "下一步"}
                    </button>
                </div>
            </div>
        </div>
    )
  }

  return <div>Unknown Mode</div>;
};

export default InteractiveInputLab;
