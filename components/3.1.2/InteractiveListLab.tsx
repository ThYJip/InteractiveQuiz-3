
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Trash2, CheckSquare, Square, Tags, AlertTriangle, CheckCircle2, Edit3, Terminal, Sparkles, Coffee, Box, LayoutList, Code, Smartphone, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

// Data models for the simulations
interface CupItem {
    id: number;
    label: string;
    checked: boolean; // "Internal State"
}

const InteractiveListLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: HETERO SORT ===
  const [sortedCount, setSortedCount] = useState(0);

  // === LAB 2 & 3: STATE DRIFT (The Cup Shuffle) ===
  const [dataList, setDataList] = useState<CupItem[]>([
      { id: 1, label: 'Cup A', checked: false },
      { id: 2, label: 'Cup B', checked: false }, 
      { id: 3, label: 'Cup C', checked: false }
  ]);
  const [positionalState, setPositionalState] = useState<boolean[]>([false, false, false]);
  const [keyedState, setKeyedState] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [bugTriggered, setBugTriggered] = useState(false);
  const [fixVerified, setFixVerified] = useState(false);


  // === LAB 4: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 5: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 6: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("LazyColumn {\n  items(messages) { msg ->\n    MessageRow(msg)\n  }\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);

  // === LAB 7: FINAL PROJECT (MULTI-STEP) ===
  const [projectStep, setProjectStep] = useState(0); // 0: Model, 1: List, 2: UI, 3: Success
  const [projectInputs, setProjectInputs] = useState(["", "", ""]);
  
  const projectStepsInfo = [
      {
          title: "Step 1: 定义数据模型",
          desc: "使用 Sealed Interface 定义 Message 类型，包含 TextMessage (id, text) 和 ImageMessage (id, url)。",
          placeholder: "sealed interface Message { ... }"
      },
      {
          title: "Step 2: 列表容器与 Key",
          desc: "使用 LazyColumn 和 items。最关键的是：必须提供 key 参数！",
          placeholder: "LazyColumn { items(..., key = { ... }) { ... } }"
      },
      {
          title: "Step 3: UI 分发逻辑",
          desc: "在 items 内部，使用 when 语句根据消息类型分发到不同的 Composable。",
          placeholder: "when(msg) { is TextMessage -> ... }"
      }
  ];


  // --- LOGIC: HETERO VISUALIZER ---
  const handleSort = () => {
      setSortedCount(prev => prev + 1);
      if (sortedCount > 2) setTimeout(onComplete, 1000);
  }

  // --- LOGIC: STATE DRIFT (BUG) ---
  const toggleCheckPosition = (index: number) => {
      setHasInteracted(true);
      setPositionalState(prev => {
          const n = [...prev];
          n[index] = !n[index];
          return n;
      });
  };

  const handleDeleteItemBug = (indexToDelete: number) => {
      setDataList(prev => prev.filter((_, i) => i !== indexToDelete));
      setPositionalState(prev => prev.slice(0, prev.length - 1));
      setBugTriggered(true);
      setTimeout(onComplete, 4000); 
  };


  // --- LOGIC: KEY FIX ---
  const toggleCheckKey = (id: number) => {
      setHasInteracted(true);
      setKeyedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteItemKey = (idToDelete: number) => {
      setDataList(prev => prev.filter(item => item.id !== idToDelete));
      setFixVerified(true);
      setTimeout(onComplete, 3000);
  };


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'POSITION') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'DATA_ID': return { correct: false, text: "错误。Compose 无法自动猜测哪个字段是 ID，你必须显式指定它。" };
          case 'RANDOM': return { correct: false, text: "错误。如果使用随机数，每次重组都会被视为全新的 Item，导致全部重新渲染，状态丢失且性能极差。" };
          case 'POSITION': return { correct: true, text: "正确！默认使用 Item 在列表中的位置索引。如果插入或删除，位置发生变化，状态就会错位。" };
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


  // --- LOGIC: AI (Assignment) ---
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
                Check if 'key' is used in items/itemsIndexed.
                Respond JSON: { "pass": boolean, "message": "string (Rin persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          console.error(error);
          setAiFeedback({ pass: false, msg: "AI 信号不佳，算你通过！(模拟)" });
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
                Step 1 Requirement: Sealed interface with 2 data classes.
                Step 2 Requirement: LazyColumn with items and KEY parameter.
                Step 3 Requirement: When expression checking types.

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
                      onComplete(); // Enable Next button in Dialog
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


  // === RENDER ===

  if (mode === 'FINAL_PROJECT') {
      if (projectStep === 3) {
          // SUCCESS SPLIT VIEW
          return (
              <div className="w-full h-full flex items-stretch gap-4 p-2 animate-fade-in">
                  {/* LEFT: FULL CODE */}
                  <div className="flex-1 bg-[#1e293b] rounded-2xl border-4 border-indigo-500 overflow-hidden flex flex-col shadow-2xl">
                      <div className="bg-[#0f172a] p-3 text-indigo-300 font-bold font-mono text-sm flex items-center gap-2">
                          <Code size={16}/> FinalCode.kt
                      </div>
                      <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                          <pre className="font-mono text-xs text-blue-200 whitespace-pre-wrap leading-relaxed">
{`// 1. Data Model
sealed interface Message {
    val id: String
    data class Text(override val id: String, val text: String) : Message
    data class Image(override val id: String, val url: String) : Message
}

// 2. List UI
@Composable
fun ChatList(messages: List<Message>) {
    LazyColumn {
        // 3. Key & Heterogeneous UI
        items(messages, key = { it.id }) { msg ->
            when(msg) {
                is Message.Text -> TextRow(msg)
                is Message.Image -> ImageRow(msg)
            }
        }
    }
}`}
                          </pre>
                      </div>
                  </div>

                  {/* RIGHT: PREVIEW */}
                  <div className="w-[300px] bg-white rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20"></div>
                      <div className="bg-indigo-600 h-16 w-full shrink-0 flex items-end pb-3 justify-center text-white font-bold shadow-md z-10">
                          Camping Chat
                      </div>
                      <div className="flex-1 bg-[#EEF2FF] p-4 overflow-y-auto space-y-3">
                          {/* Simulated Chat Items */}
                          <div className="flex gap-2">
                              <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center shrink-0">N</div>
                              <div className="bg-white p-2 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-700 max-w-[80%]">
                                  大家到了吗？
                              </div>
                          </div>
                          <div className="flex gap-2 flex-row-reverse">
                              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center shrink-0">R</div>
                              <div className="bg-blue-600 text-white p-2 rounded-2xl rounded-tr-none shadow-sm text-xs max-w-[80%]">
                                  刚到，正在搭帐篷。
                              </div>
                          </div>
                          <div className="flex gap-2 flex-row-reverse">
                               <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center shrink-0">R</div>
                               <div className="w-32 h-24 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative">
                                   <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                               </div>
                          </div>
                           <div className="flex gap-2">
                              <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center shrink-0">N</div>
                              <div className="bg-white p-2 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-700 max-w-[80%]">
                                  哇！我也马上到！
                              </div>
                          </div>
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
                          <Terminal size={18} /> Final Project: Step {projectStep + 1}/3
                      </div>
                      <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                              <div key={i} className={`w-20 h-2 rounded-full transition-colors ${i <= projectStep ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                          ))}
                      </div>
                  </div>

                  <div className="bg-slate-800/50 p-6 border-b border-slate-700">
                      <h3 className="text-white font-bold text-lg mb-2">{info.title}</h3>
                      <p className="text-blue-200 text-sm font-mono leading-relaxed">
                          <span className="text-green-400">TODO:</span> {info.desc}
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
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50"
                      >
                          {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} 
                          {projectStep === 2 ? "完成构建" : "下一步"}
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // --- EXISTING LAB MODES ---

  if (mode === 'HETERO_VISUALIZER') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              <div className="bg-white/80 px-6 py-2 rounded-full font-bold text-indigo-900 border border-indigo-200">
                  点击物品，将它们归类到正确的 UI 样式中
              </div>
              <div className="flex gap-4">
                  {['Food', 'Gear', 'Food', 'Gear'].map((type, i) => (
                      <button 
                         key={i} 
                         onClick={handleSort}
                         className="w-20 h-20 bg-white rounded-xl shadow-md flex flex-col items-center justify-center gap-2 hover:scale-110 transition-transform active:scale-90"
                      >
                          {type === 'Food' ? <Coffee className="text-amber-500"/> : <Box className="text-blue-500"/>}
                          <span className="text-xs font-mono">{type}</span>
                      </button>
                  ))}
              </div>
              
              <div className="w-full max-w-md bg-indigo-50 rounded-2xl p-4 border-2 border-indigo-100 min-h-[150px] flex flex-col gap-2 transition-all">
                  <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">LazyColumn Rendering...</div>
                  {Array.from({length: sortedCount}).map((_, i) => (
                      <div key={i} className="animate-slide-in-right">
                          {i % 2 === 0 
                            ? <div className="bg-amber-100 p-2 rounded text-amber-800 text-xs font-bold flex items-center gap-2"><Coffee size={14}/> FoodItem Composable</div>
                            : <div className="bg-blue-100 p-2 rounded text-blue-800 text-xs font-bold flex items-center gap-2"><Box size={14}/> GearItem Composable</div>
                          }
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  if (mode === 'STATE_DRIFT_BUG' || mode === 'KEY_FIX') {
      const isBug = mode === 'STATE_DRIFT_BUG';
      
      return (
          <div className="w-full h-full flex flex-col items-center justify-start pt-10 p-4 gap-8">
              <div className={`px-6 py-2 rounded-full font-bold text-sm shadow-sm border flex items-center gap-2 ${isBug ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                  {isBug ? <AlertTriangle size={16}/> : <CheckCircle2 size={16}/>}
                  {isBug ? "任务：勾选第2个杯子(Cup B)，然后删除第1个杯子(Cup A)" : "任务：开启 Key 保护，重试上述操作"}
              </div>

              <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-700">My Cup List</span>
                      <span className="text-xs font-mono text-slate-400">{isBug ? "No Key" : "Keyed"}</span>
                  </div>
                  
                  <div className="p-4 space-y-3">
                      {dataList.map((item, index) => {
                          // Determine visual checked state
                          const isChecked = isBug ? positionalState[index] : keyedState[item.id];
                          
                          return (
                              <div key={isBug ? index : item.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm transition-all animate-fade-in">
                                  <button 
                                    onClick={() => isBug ? toggleCheckPosition(index) : toggleCheckKey(item.id)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-300'}`}
                                  >
                                      {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                                  </button>
                                  <div className="flex-1 font-bold text-slate-700">{item.label}</div>
                                  <button 
                                    onClick={() => isBug ? handleDeleteItemBug(index) : handleDeleteItemKey(item.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                      <Trash2 size={18} />
                                  </button>
                              </div>
                          )
                      })}
                      {dataList.length === 0 && <div className="text-center text-slate-400 py-4">Empty List</div>}
                  </div>
              </div>

              {/* Visualization of the Bug/Fix */}
              <div className="text-center max-w-md">
                   {bugTriggered && (
                       <div className="bg-red-100 text-red-800 p-4 rounded-xl border border-red-200 animate-bounce">
                           <h4 className="font-bold mb-1">发生了什么？</h4>
                           <p className="text-xs">
                               你删除了 Cup A (位置 0)。Cup B 移动到了位置 0。
                               但位置 0 的状态是“未选中”！
                               Cup C 移动到了位置 1，继承了原本位置 1 的“已选中”状态！
                               <br/><b>状态和数据错位了！</b>
                           </p>
                       </div>
                   )}
                   {fixVerified && (
                       <div className="bg-green-100 text-green-800 p-4 rounded-xl border border-green-200 animate-pulse">
                           <h4 className="font-bold mb-1">完美！</h4>
                           <p className="text-xs">
                               有了 Key，Compose 知道 Cup B 是 ID:2。
                               即使它移动到了位置 0，它的状态依然紧紧跟随 ID:2。
                           </p>
                       </div>
                   )}
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
      const feedback = getQuizFeedback();
      const isSolved = quizChoice === 'POSITION';

      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-indigo-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-100 p-2 rounded-full"><LayoutList className="text-indigo-600" /></div>
                    <h3 className="text-xl font-bold text-indigo-900">前辈的提问</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    在 LazyColumn 中，如果我不提供 `key` 参数，Compose 默认使用什么作为 key？
                </p>
                <div className="space-y-3">
                    {['DATA_ID (数据ID)', 'POSITION (列表位置)', 'RANDOM (随机数)'].map((opt) => {
                        const val = opt.split(' ')[0];
                        const isSelected = quizChoice === val;
                        const isCorrect = val === 'POSITION';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
                        }

                        return (
                            <button key={val} onClick={() => handleQuiz(val)} className={btnClass} disabled={isSolved}>
                                {opt}
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
                        <Edit3 size={24} /> 露营笔记：Key 的写法
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
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Key Memorized!</p>}
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
                    <p className="text-blue-200 text-sm font-mono"><span className="text-green-400">#</span> {config.assignmentPrompt}</p>
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
                    {/* HIDE BUTTON ON SUCCESS */}
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

export default InteractiveListLab;
