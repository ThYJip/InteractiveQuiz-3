
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Image as ImageIcon, Maximize, Crop, StretchHorizontal, User, HelpCircle, Edit3, Terminal, Sparkles, AlertCircle, CheckCircle2, Eye, EyeOff, Heart, Settings, Menu } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveImageLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: SCALE LAB ===
  const [scaleMode, setScaleMode] = useState<'FillBounds' | 'Crop' | 'Fit'>('FillBounds');
  const [scaleSuccess, setScaleSuccess] = useState(false);

  // === LAB 2: TINT LAB ===
  const [tintContainer, setTintContainer] = useState<'SURFACE' | 'BUTTON' | 'ERROR'>('SURFACE');
  const [tintObserved, setTintObserved] = useState(false);

  // === LAB 3: A11Y AUDIT ===
  const [auditStep, setAuditStep] = useState(0); // 0: Decorative, 1: Informative
  const [auditScore, setAuditScore] = useState(0);

  // === LAB 4: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 5: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 6: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("Icon(\n  imageVector = Icons.Default.Favorite,\n  contentDescription = ...\n)");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);

  // === LAB 7: FINAL PROJECT ===
  const [projectStep, setProjectStep] = useState(0);
  const [projectInputs, setProjectInputs] = useState(["", "", ""]);
  
  const projectStepsInfo = [
      {
          title: "Step 1: 头像 (Image)",
          desc: "创建一个圆形裁剪的头像。使用 `ContentScale.Crop` 和 `CircleShape` (clip)。",
          placeholder: "Image(..., contentScale = ContentScale.Crop, modifier = Modifier.clip(CircleShape))"
      },
      {
          title: "Step 2: 信息图标 (Icon)",
          desc: "添加一个邮件图标。不需要手动设置颜色，让它跟随文本颜色（灰色）。注意无障碍描述。",
          placeholder: "Icon(Icons.Default.Email, contentDescription = \"Email\")"
      },
      {
          title: "Step 3: 组合布局",
          desc: "将头像和图标放入 Row 中。添加间距。",
          placeholder: "Row { Avatar(...); Spacer(...); Icon(...) }"
      }
  ];


  // --- LOGIC: SCALE LAB ---
  const handleScaleChange = (m: 'FillBounds' | 'Crop' | 'Fit') => {
      setScaleMode(m);
      if (m === 'Crop' || m === 'Fit') {
          // Both are valid "fixes" compared to the initial FillBounds stretch
          if (!scaleSuccess) {
              setScaleSuccess(true);
              setTimeout(onComplete, 2000);
          }
      }
  };

  // --- LOGIC: TINT LAB ---
  const handleTintChange = (c: 'SURFACE' | 'BUTTON' | 'ERROR') => {
      setTintContainer(c);
      if (!tintObserved) {
          // Require at least 2 clicks to "observe" behavior
          setTintObserved(true);
      } else {
          setTimeout(onComplete, 1500);
      }
  };

  // --- LOGIC: A11Y AUDIT ---
  const handleAudit = (choice: 'NULL' | 'DESC') => {
      if (auditStep === 0) {
          // Image 1: Decorative Background -> Expect NULL
          if (choice === 'NULL') {
              setAuditStep(1);
          } else {
              alert("不对哦，这个背景图没有具体含义，读出来会打扰用户。");
          }
      } else {
          // Image 2: Menu Button -> Expect DESC
          if (choice === 'DESC') {
              onComplete();
          } else {
              alert("不对哦，这是一个功能按钮，盲人用户如果不听到描述，就不知道它是干什么的。");
          }
      }
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'NULL') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'EMPTY': return { correct: false, text: "错误。空字符串 \"\" 会让 TalkBack 读出“未加标签的图片”，依然是噪音。" };
          case 'DESCRIBE': return { correct: false, text: "错误。如果是纯装饰性的，不需要描述它长什么样。" };
          case 'NULL': return { correct: true, text: "正确！设置 null 会告诉辅助服务完全忽略这个元素，提供最清爽的体验。" };
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
                Check for Icon, tint=Color.Red, and a valid contentDescription string.
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
              Step 1 Req: Image, ContentScale.Crop, CircleShape.
              Step 2 Req: Icon, explicit contentDescription (not null).
              Step 3 Req: Row layout.

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

  if (mode === 'SCALE_LAB') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-cyan-100 flex flex-col gap-4 items-center">
                  <div className="w-64 h-64 bg-slate-200 overflow-hidden relative border-2 border-slate-300">
                      {/* Simulation of Image */}
                      <div className={`w-full h-full bg-cover bg-center transition-all duration-500`}
                           style={{ 
                               backgroundImage: 'url("https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=1000&auto=format&fit=crop")',
                               backgroundSize: scaleMode === 'FillBounds' ? '100% 100%' : (scaleMode === 'Crop' ? 'cover' : 'contain'),
                               backgroundRepeat: 'no-repeat'
                           }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono">
                          {scaleMode}
                      </div>
                  </div>
                  
                  <div className="flex gap-2">
                      <button 
                        onClick={() => handleScaleChange('FillBounds')}
                        className={`px-3 py-1 rounded border text-xs font-bold ${scaleMode === 'FillBounds' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-50'}`}
                      >
                          FillBounds (Bad)
                      </button>
                      <button 
                        onClick={() => handleScaleChange('Fit')}
                        className={`px-3 py-1 rounded border text-xs font-bold ${scaleMode === 'Fit' ? 'bg-cyan-100 text-cyan-700 border-cyan-300' : 'bg-slate-50'}`}
                      >
                          Fit (Good)
                      </button>
                      <button 
                        onClick={() => handleScaleChange('Crop')}
                        className={`px-3 py-1 rounded border text-xs font-bold ${scaleMode === 'Crop' ? 'bg-cyan-100 text-cyan-700 border-cyan-300' : 'bg-slate-50'}`}
                      >
                          Crop (Good)
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'TINT_LAB') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
                  {/* Container 1: Surface */}
                  <button onClick={() => handleTintChange('SURFACE')} className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${tintContainer === 'SURFACE' ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-slate-200'}`}>
                      <div className="text-slate-500 font-bold">Surface</div>
                      <div className="text-slate-800 bg-slate-100 p-2 rounded">
                          <Heart size={32} fill="currentColor" /> {/* Inherits text color */}
                      </div>
                  </button>

                  {/* Container 2: Button */}
                  <button onClick={() => handleTintChange('BUTTON')} className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${tintContainer === 'BUTTON' ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-slate-200'}`}>
                      <div className="text-slate-500 font-bold">Primary Button</div>
                      <div className="bg-cyan-600 text-white p-2 rounded shadow-lg">
                          <Heart size={32} fill="currentColor" />
                      </div>
                  </button>

                  {/* Container 3: Error */}
                  <button onClick={() => handleTintChange('ERROR')} className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${tintContainer === 'ERROR' ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-slate-200'}`}>
                      <div className="text-slate-500 font-bold">Error Text</div>
                      <div className="text-red-500 bg-red-50 p-2 rounded border border-red-100">
                          <Heart size={32} fill="currentColor" />
                      </div>
                  </button>
              </div>
              <p className="text-cyan-700 font-bold text-sm bg-cyan-50 px-4 py-2 rounded-full border border-cyan-100">
                  Icon 自动跟随容器的 LocalContentColor
              </p>
          </div>
      )
  }

  if (mode === 'A11Y_AUDIT') {
      const isDecorative = auditStep === 0;
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-slate-200 w-full max-w-sm flex flex-col items-center gap-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accessibility Audit</div>
                  
                  {/* The Element to Audit */}
                  <div className="p-8 bg-slate-100 rounded-xl w-full flex justify-center relative overflow-hidden">
                      {isDecorative ? (
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 2px, transparent 2.5px)', backgroundSize: '10px 10px' }}></div>
                      ) : (
                          <button className="bg-white p-3 rounded shadow border border-slate-300">
                              <Menu size={24} className="text-slate-700" />
                          </button>
                      )}
                  </div>
                  
                  <div className="text-center mb-4">
                      <h4 className="font-bold text-slate-800">{isDecorative ? "Decorative Pattern" : "Menu Icon"}</h4>
                      <p className="text-xs text-slate-500">{isDecorative ? "纯背景装饰，无功能" : "点击打开侧边栏"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                      <button 
                        onClick={() => handleAudit('DESC')}
                        className="p-3 border-2 border-cyan-200 rounded-lg text-cyan-700 font-bold text-xs hover:bg-cyan-50 active:scale-95 transition-transform"
                      >
                          Add Description
                      </button>
                      <button 
                        onClick={() => handleAudit('NULL')}
                        className="p-3 border-2 border-slate-300 rounded-lg text-slate-600 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-transform"
                      >
                          Set to NULL
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'NULL';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-cyan-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-cyan-100 p-2 rounded-full"><HelpCircle className="text-cyan-600" /></div>
                    <h3 className="text-xl font-bold text-cyan-900">无障碍测验</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    对于纯装饰性的背景图片，`contentDescription` 应该填什么？
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'EMPTY', label: '"" (空字符串)' },
                        { val: 'DESCRIBE', label: '"漂亮的背景图"' },
                        { val: 'NULL', label: 'null' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'NULL';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 text-slate-700";
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
            <div className="bg-[#ECFEFF] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-cyan-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-cyan-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：无障碍规则
                    </h3>
                    <div className="bg-cyan-100 p-4 rounded-lg border border-cyan-300 mb-4 font-mono text-sm text-cyan-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-cyan-300 text-cyan-900 focus:border-cyan-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Noted!</p>}
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
                    <p className="text-blue-200 text-sm font-mono"><span className="text-cyan-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-500">
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
                    {/* LEFT: FULL CODE */}
                    <div className="flex-1 bg-[#1e293b] rounded-2xl border-4 border-cyan-500 overflow-hidden flex flex-col shadow-2xl">
                        <div className="bg-[#0f172a] p-3 text-cyan-300 font-bold font-mono text-sm flex items-center gap-2">
                            <User size={16}/> ProfileCard.kt
                        </div>
                        <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                            <pre className="font-mono text-xs text-blue-200 whitespace-pre-wrap leading-relaxed">
{`@Composable
fun ProfileCard() {
    Row(verticalAlignment = Alignment.CenterVertically) {
        // 1. Avatar
        Image(
            painter = painterResource(R.drawable.rin),
            contentDescription = null, // Decorative
            contentScale = ContentScale.Crop,
            modifier = Modifier.clip(CircleShape)
        )
        
        Spacer(Modifier.width(16.dp))

        // 2. Info Icon
        Icon(
            imageVector = Icons.Default.Email,
            contentDescription = "Send Email", // Informative
            tint = Color.Gray
        )
    }
}`}
                            </pre>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW */}
                    <div className="w-[300px] bg-white rounded-xl border-8 border-slate-300 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-100 shadow-md">
                             <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop")' }}></div>
                        </div>
                        <h3 className="font-bold text-slate-800 text-xl">Nadeshiko</h3>
                        <div className="flex gap-4">
                            <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-cyan-100 hover:text-cyan-600 transition-colors" title="Email">
                                <span className="sr-only">Email</span>
                                <div className="w-6 h-6 border-2 border-current rounded flex items-center justify-center text-[10px] font-bold">@</div>
                            </button>
                            <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-pink-100 hover:text-pink-600 transition-colors" title="Like">
                                <Heart size={24} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* OVERLAY INDICATOR */}
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white/95 border-4 border-cyan-400 text-cyan-700 px-8 py-6 rounded-3xl shadow-2xl animate-bounce flex flex-col items-center gap-2 text-center transform scale-110 pointer-events-auto">
                        <CheckCircle2 size={48} className="text-green-500 mb-2" />
                        <span className="text-2xl font-black tracking-tight">名片制作完成！</span>
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
                            <div key={i} className={`w-20 h-2 rounded-full transition-colors ${i <= projectStep ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 border-b border-slate-700">
                    <h3 className="text-white font-bold text-lg mb-2">{info.title}</h3>
                    <p className="text-blue-200 text-sm font-mono leading-relaxed">
                        <span className="text-cyan-400">TODO:</span> {info.desc}
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

export default InteractiveImageLab;
