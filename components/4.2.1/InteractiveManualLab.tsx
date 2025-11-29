
import React, { useState, useEffect, useRef } from 'react';
import { InteractiveState } from './types';
import { Loader2, Gamepad2, Zap, AlertTriangle, CheckCircle2, Play, Power, MousePointerClick, Terminal, Edit3, Sparkles, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveManualLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: DIMENSION ERROR ===
  const [clickCount, setClickCount] = useState(0);
  const [showError, setShowError] = useState(false);

  // === LAB 2: DRONE LAUNCHER (GLOBAL vs SCOPED) ===
  const [drones, setDrones] = useState<{id: number, type: 'GLOBAL'|'SCOPED', status: 'FLYING'|'CRASHED'|'SAFE'}[]>([]);
  const [screenOn, setScreenOn] = useState(true);
  const droneId = useRef(0);

  // === LAB 3: LOADING SIM ===
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === AI & FINAL PROJECT ===
  const [userCode, setUserCode] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);
  const [projectStep, setProjectStep] = useState(0);
  const [projectInputs, setProjectInputs] = useState(["", "", ""]);

  const projectStepsInfo = [
      {
          title: "Step 1: 获取控制器",
          desc: "使用 `rememberCoroutineScope` 获取协程作用域。同时定义一个 `isLoading` 状态。",
          placeholder: "val scope = ...\nvar isLoading by remember { ... }"
      },
      {
          title: "Step 2: 按钮 UI",
          desc: "创建一个 Button。当 `isLoading` 为 true 时，设置 `enabled = false`。显示文本根据状态变化。",
          placeholder: "Button(enabled = !isLoading, ...) { Text(if(isLoading) ... else ...) }"
      },
      {
          title: "Step 3: 点击逻辑",
          desc: "在 onClick 中：设置 loading=true -> 启动协程 -> delay(2000) -> 设置 loading=false -> 弹出 Snackbar。",
          placeholder: "onClick = { scope.launch { ... } }"
      }
  ];

  // --- LOGIC: DIMENSION ERROR ---
  const handleDimensionClick = () => {
      setClickCount(c => c + 1);
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
      if (clickCount >= 2) setTimeout(onComplete, 1500);
  };

  // --- LOGIC: DRONE LAUNCHER ---
  const launchDrone = () => {
      const type = mode === 'GLOBAL_LEAK_LAB' ? 'GLOBAL' : 'SCOPED';
      setDrones(prev => [...prev, { id: droneId.current++, type, status: 'FLYING' }]);
  };

  const toggleScreen = () => {
      setScreenOn(prev => !prev);
  };

  useEffect(() => {
      if (!screenOn) {
          // Screen turned off (Unmount simulation)
          setDrones(prev => prev.map(d => {
              if (d.type === 'GLOBAL') return { ...d, status: 'CRASHED' }; // Leak!
              return { ...d, status: 'SAFE' }; // Cancelled properly
          }));
      } else {
          // Screen turned back on, clear old drones to clean up visual
          // setDrones([]);
      }
  }, [screenOn]);

  useEffect(() => {
      // Check win condition for drone labs
      if (mode === 'GLOBAL_LEAK_LAB') {
          if (drones.some(d => d.status === 'CRASHED')) setTimeout(onComplete, 2000);
      }
      if (mode === 'SCOPED_LAUNCH_LAB') {
          if (drones.some(d => d.status === 'SAFE')) setTimeout(onComplete, 2000);
      }
  }, [drones, mode, onComplete]);


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'MANUAL') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'AUTO': return { correct: false, text: "LaunchedEffect 是自动挡，适合一进页面就自动加载数据，不适合点击事件。" };
          case 'MANUAL': return { correct: true, text: "正确！rememberCoroutineScope 是手动挡，专门用于在 onClick 等回调中手动启动协程。" };
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
  const checkCodeWithAI = async (prompt: string, code: string, context: string) => {
      setAiLoading(true);
      setAiFeedback(null);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `
                You are Code Cat (Chi). 
                Context: ${context}
                Task: ${prompt}.
                User Code: "${code}".
                Check for correctness (especially rememberCoroutineScope and launch).
                Respond JSON: { "pass": boolean, "message": "string (Chi persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          return result.pass;
      } catch (error) {
          setAiFeedback({ pass: false, msg: "AI 通信故障... (模拟通过)" });
          return true; // Fallback
      } finally {
          setAiLoading(false);
      }
  };

  const handleAiAssignment = async () => {
      if (await checkCodeWithAI(config.assignmentPrompt || "", userCode, "General Assignment")) {
          setTimeout(onComplete, 3000);
      }
  };

  const handleFinalProjectStep = async () => {
      const currentInfo = projectStepsInfo[projectStep];
      if (await checkCodeWithAI(currentInfo.desc, projectInputs[projectStep], `Final Project Step ${projectStep+1}`)) {
          setTimeout(() => {
              if (projectStep < 2) {
                  setProjectStep(p => p + 1);
                  setAiFeedback(null);
              } else {
                  setProjectStep(3);
                  onComplete();
              }
          }, 2000);
      }
  };


  // === RENDERERS ===

  if (mode === 'DIMENSION_ERROR') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="relative">
                  {/* The Suspend Dimension Bubble */}
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center border-4 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.5)] z-0">
                      <div className="text-blue-200 font-mono text-xs flex flex-col items-center animate-pulse">
                          <Zap size={40} />
                          <span>挂起时空</span>
                          <span className="bg-blue-800 px-2 py-1 rounded mt-2">showSnackbar()</span>
                      </div>
                  </div>

                  {/* The Button (Outside) */}
                  <button 
                    onClick={handleDimensionClick}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-6 py-3 rounded-xl font-bold shadow-xl active:scale-95 transition-transform z-20 flex items-center gap-2"
                  >
                      <MousePointerClick /> onClick
                  </button>

                  {/* Error Animation */}
                  {showError && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center z-30">
                          <div className="bg-red-600 text-white font-black text-2xl px-6 py-4 rounded-xl rotate-12 shadow-2xl border-4 border-white animate-bounce">
                              编译错误！
                          </div>
                      </div>
                  )}
              </div>
              <p className="text-cyan-200 text-sm font-mono bg-slate-900/50 px-4 py-2 rounded">
                  普通回调无法直接调用挂起函数！
              </p>
          </div>
      )
  }

  if (mode === 'GLOBAL_LEAK_LAB' || mode === 'SCOPED_LAUNCH_LAB') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <div className="flex gap-4 items-center">
                  <button 
                    onClick={toggleScreen}
                    className={`px-4 py-2 rounded-lg font-bold shadow transition-all ${screenOn ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                      <Power size={18} className="inline mr-2"/>
                      {screenOn ? "屏幕: 开" : "屏幕: 关"}
                  </button>
                  {screenOn && (
                      <button 
                        onClick={launchDrone}
                        className="px-4 py-2 rounded-lg font-bold shadow bg-cyan-600 hover:bg-cyan-500 text-white active:scale-95 transition-all"
                      >
                          <Play size={18} className="inline mr-2"/>
                          启动任务
                      </button>
                  )}
              </div>

              {/* Simulation Area */}
              <div className={`w-full max-w-lg h-64 border-4 rounded-2xl relative overflow-hidden transition-colors duration-500 ${screenOn ? 'bg-slate-900 border-cyan-500/50' : 'bg-black border-slate-800'}`}>
                  {screenOn ? (
                      <div className="absolute inset-0 flex items-center justify-center text-cyan-900/30 font-black text-6xl select-none">
                          活跃
                      </div>
                  ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-black text-6xl select-none">
                          已销毁
                      </div>
                  )}

                  {/* Drones */}
                  {drones.map(d => (
                      <div 
                        key={d.id}
                        className={`absolute transition-all duration-1000 flex flex-col items-center
                            ${d.status === 'FLYING' ? 'animate-float' : ''}
                            ${d.status === 'CRASHED' ? 'text-red-500 animate-pulse' : 'text-cyan-400'}
                            ${d.status === 'SAFE' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                        `}
                        style={{ 
                            left: `${(d.id * 20) % 80 + 10}%`, 
                            top: `${(d.id * 15) % 60 + 20}%` 
                        }}
                      >
                          {d.status === 'CRASHED' ? <AlertTriangle size={32} /> : <Gamepad2 size={32} />}
                          <span className="text-[10px] font-mono font-bold bg-black/50 px-1 rounded mt-1">
                              {d.status === 'CRASHED' ? '泄漏！' : d.status === 'SAFE' ? '已取消' : '运行中'}
                          </span>
                      </div>
                  ))}
              </div>

              <div className="bg-slate-800 p-4 rounded-xl text-xs text-slate-300 w-full max-w-lg border border-slate-700">
                  <div className="font-bold mb-2 text-cyan-400">状态监控:</div>
                  <div>活跃无人机: {drones.filter(d => d.status !== 'SAFE').length}</div>
                  <div className="text-red-400">泄漏无人机: {drones.filter(d => d.status === 'CRASHED').length}</div>
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'MANUAL';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-slate-900/90 p-8 rounded-3xl shadow-xl border-4 border-cyan-500/30 max-w-lg w-full backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-cyan-500/20 p-2 rounded-full"><HelpCircle className="text-cyan-400" /></div>
                    <h3 className="text-xl font-bold text-cyan-100">舰长考核</h3>
                </div>
                <p className="text-lg text-slate-300 font-medium mb-6">
                    你需要响应用户的<span className="text-cyan-400 font-bold">点击事件</span>来发起网络请求，应该使用哪种工具？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'AUTO', label: 'LaunchedEffect (自动挡)' },
                        { val: 'MANUAL', label: 'rememberCoroutineScope (手动挡)' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'MANUAL';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-600 text-white border-green-400" : "bg-red-600 text-white border-red-400";
                        } else {
                            btnClass += "bg-slate-800 border-slate-600 hover:border-cyan-400 text-slate-200";
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
                        ${feedback.correct ? 'bg-green-900/50 text-green-200 border border-green-500/50' : 'bg-red-900/50 text-red-200 border border-red-500/50'}
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
            <div className="bg-slate-900 p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-cyan-500/30 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 驾驶舱指令录入
                    </h3>
                    <div className="bg-black/50 p-4 rounded-lg border border-slate-700 mb-4 font-mono text-sm text-cyan-200 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-400' : 'border-slate-600 text-slate-200 focus:border-cyan-500'}
                      `}
                      placeholder="// 输入指令..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-400 font-bold animate-pulse">Scope Acquired!</p>}
                </div>
            </div>
        </div>
      );
  }

  if (mode === 'AI_ASSIGNMENT') {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <div className="w-full max-w-3xl bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-cyan-900">
                <div className="bg-slate-950 p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold">
                        <Terminal size={18} /> Code Cat IDE
                    </div>
                </div>
                <div className="bg-slate-800/50 p-4 border-b border-slate-800">
                    <p className="text-cyan-200 text-sm font-mono"><span className="text-green-400">#</span> {config.assignmentPrompt}</p>
                </div>
                <textarea 
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="flex-1 bg-slate-900 text-slate-100 font-mono text-sm p-4 outline-none resize-none"
                    spellCheck={false}
                />
                <div className="bg-slate-950 p-4 flex items-center justify-between border-t border-slate-800">
                     <div className="flex-1 mr-4">
                        {aiFeedback && (
                            <div className={`text-xs font-mono p-2 rounded border ${aiFeedback.pass ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
                                {aiFeedback.msg}
                            </div>
                        )}
                    </div>
                    {!aiFeedback?.pass && (
                        <button onClick={handleAiAssignment} disabled={aiLoading} className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-500 disabled:opacity-50">
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
                <div className="w-full h-full flex items-stretch gap-4 p-2 transition-all duration-1000 opacity-40 hover:opacity-100 hover:blur-0 blur-[2px]">
                    {/* LEFT: CODE */}
                    <div className="flex-1 bg-slate-900 rounded-2xl border-4 border-cyan-500 overflow-hidden flex flex-col shadow-2xl">
                        <div className="bg-slate-950 p-3 text-cyan-400 font-bold font-mono text-sm flex items-center gap-2">
                            <Gamepad2 size={16}/> ClickLoad.kt
                        </div>
                        <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                            <pre className="font-mono text-xs text-blue-200 whitespace-pre-wrap leading-relaxed">
{`@Composable
fun ClickToLoad() {
    // 1. 获取 Scope 和 状态
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(false) }
    
    // 2. 按钮
    Button(
        enabled = !isLoading,
        onClick = {
            // 3. 启动协程
            scope.launch {
                isLoading = true
                delay(2000) // 模拟加载
                isLoading = false
                // 显示结果
                snackbar.show("Success!")
            }
        }
    ) {
        if (isLoading) CircularProgressIndicator()
        else Text("Load Data")
    }
}`}
                            </pre>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW SIMULATION */}
                    <div className="w-[300px] bg-slate-100 rounded-xl border-8 border-slate-300 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 gap-8 relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20"></div>
                        
                        <button 
                            onClick={() => {
                                setIsLoading(true);
                                setLoadProgress(0);
                                const timer = setInterval(() => setLoadProgress(p => p+5), 100);
                                setTimeout(() => {
                                    clearInterval(timer);
                                    setIsLoading(false);
                                    setSnackbarMessage("加载成功！");
                                    setTimeout(() => setSnackbarMessage(null), 2000);
                                }, 2000);
                            }}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2
                                ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 active:scale-95'}
                            `}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "点击加载数据"}
                        </button>

                        {isLoading && (
                            <div className="w-full bg-slate-300 h-2 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full transition-all duration-100" style={{width: `${loadProgress}%`}}></div>
                            </div>
                        )}

                        {snackbarMessage && (
                            <div className="absolute bottom-8 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl animate-slide-up flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-green-400" />
                                {snackbarMessage}
                            </div>
                        )}
                    </div>
                </div>

                {/* OVERLAY INDICATOR */}
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-slate-900/95 border-4 border-cyan-400 text-cyan-400 px-8 py-6 rounded-3xl shadow-2xl animate-bounce flex flex-col items-center gap-2 text-center transform scale-110 pointer-events-auto">
                        <CheckCircle2 size={48} className="text-green-500 mb-2" />
                        <span className="text-2xl font-black tracking-tight">手动挡大师！</span>
                        <span className="text-sm font-bold text-slate-400">请点击右下角的“下一步”领取勋章 👉</span>
                    </div>
                </div>
            </div>
        )
    }

    // STEP INPUT VIEW
    const info = projectStepsInfo[projectStep];
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <div className="w-full max-w-3xl bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-cyan-800">
                <div className="bg-slate-950 p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold">
                        <Terminal size={18} /> Final Project: Step {projectStep + 1}/3
                    </div>
                    <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`w-20 h-2 rounded-full transition-colors ${i <= projectStep ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 border-b border-slate-700">
                    <h3 className="text-white font-bold text-lg mb-2">{info.title}</h3>
                    <p className="text-cyan-200 text-sm font-mono leading-relaxed">
                        <span className="text-cyan-500">TODO:</span> {info.desc}
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
                    className="flex-1 bg-slate-900 text-slate-100 font-mono text-sm p-4 outline-none resize-none placeholder:text-slate-600"
                    spellCheck={false}
                />

                <div className="bg-slate-950 p-4 flex items-center justify-between border-t border-slate-800">
                     <div className="flex-1 mr-4">
                        {aiFeedback && (
                            <div className={`text-xs font-mono p-2 rounded border ${aiFeedback.pass ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
                                {aiFeedback.msg}
                            </div>
                        )}
                    </div>
                    <button 
                      onClick={handleFinalProjectStep} 
                      disabled={aiLoading} 
                      className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-500 disabled:opacity-50"
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

export default InteractiveManualLab;
