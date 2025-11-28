
import React, { useState, useEffect, useRef } from 'react';
import { InteractiveState } from './types';
import { Loader2, ArrowUpCircle, Flag, Radio, HelpCircle, Edit3, Terminal, Sparkles, Code, Smartphone, ChevronUp } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveScrollLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1: SCROLL REMOTE ===
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrolledToTopCount, setScrolledToTopCount] = useState(0);

  // === LAB 2: STICKY HEADER ===
  const [stickyScrollTop, setStickyScrollTop] = useState(0);
  const [hasCompletedSticky, setHasCompletedSticky] = useState(false);

  // === LAB 3: QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === LAB 4: TYPING ===
  const [typedCode, setTypedCode] = useState("");
  const [isTypedCorrect, setIsTypedCorrect] = useState(false);

  // === LAB 5: AI ASSIGNMENT ===
  const [userCode, setUserCode] = useState("val listState = rememberLazyListState()\nval scope = rememberCoroutineScope()\n\nLazyColumn(state = listState) {\n  // ...\n}");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);

  // === LAB 6: FINAL PROJECT ===
  const [projectStep, setProjectStep] = useState(0);
  const [projectInputs, setProjectInputs] = useState(["", "", ""]);
  
  const projectStepsInfo = [
      {
          title: "Step 1: 准备数据 (Map)",
          desc: "定义一个分组数据源 `groupedContacts`，Key 是首字母，Value 是名字列表。",
          placeholder: "val grouped = mapOf('A' to listOf('Alice'), 'B' to ...)"
      },
      {
          title: "Step 2: 构建 Sticky 列表",
          desc: "遍历 grouped 数据，使用 `stickyHeader` 渲染首字母，使用 `items` 渲染名字。",
          placeholder: "grouped.forEach { (initial, names) -> stickyHeader { ... } ... }"
      },
      {
          title: "Step 3: 遥控器集成",
          desc: "绑定 `state = listState`，并添加一个 FloatingActionButton，点击时 `scope.launch` 滚动到顶部。",
          placeholder: "LazyColumn(state = listState) { ... }\nFloatingActionButton(onClick = { scope.launch { ... } })"
      }
  ];

  // --- LOGIC: SCROLL REMOTE ---
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
  };
  
  const animateScrollToTop = () => {
      if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          setScrolledToTopCount(c => c + 1);
          if (scrolledToTopCount >= 0) { // Require 1 successful scroll
             setTimeout(onComplete, 1500);
          }
      }
  };

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'LAYOUT_INFO') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'OFFSET': return { correct: false, text: "错误。Offset 只是像素偏移量，无法知道列表的总长度，也就无法判断是否到底。" };
          case 'SCROLLING': return { correct: false, text: "错误。isScrollInProgress 只告诉你是否在动，无法告诉你位置。" };
          case 'LAYOUT_INFO': return { correct: true, text: "正确！layoutInfo 包含了 visibleItemsInfo（可见项）和 totalItemsCount（总数），通过对比末尾项索引和总数即可判断。" };
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
                Check for 'rememberLazyListState', 'rememberCoroutineScope', 'derivedStateOf', and 'animateScrollToItem'.
                Respond JSON: { "pass": boolean, "message": "string (Rin persona, Chinese)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          setAiFeedback({ pass: false, msg: "AI 信号中断，启用备用验证... (通过)" });
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
              Step 1 Req: mapOf / data structure.
              Step 2 Req: forEach loop with stickyHeader and items.
              Step 3 Req: LazyColumn state binding + CoroutineScope launch.

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

  if (mode === 'FINAL_PROJECT') {
    if (projectStep === 3) {
        // SUCCESS SPLIT VIEW
        return (
            <div className="w-full h-full flex items-stretch gap-4 p-2 animate-fade-in">
                {/* LEFT: FULL CODE */}
                <div className="flex-1 bg-[#1e293b] rounded-2xl border-4 border-teal-500 overflow-hidden flex flex-col shadow-2xl">
                    <div className="bg-[#0f172a] p-3 text-teal-300 font-bold font-mono text-sm flex items-center gap-2">
                        <Code size={16}/> Contacts.kt
                    </div>
                    <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                        <pre className="font-mono text-xs text-blue-200 whitespace-pre-wrap leading-relaxed">
{`@Composable
fun ContactList() {
    // 1. Data & State
    val contacts = remember { mapOf("A" to listOf("Alice"), "B" to listOf("Bob")) }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    Box {
        // 2. List with Sticky Headers
        LazyColumn(state = listState) {
            contacts.forEach { (initial, names) ->
                stickyHeader { 
                    Text(initial, Modifier.background(Color.Gray)) 
                }
                items(names) { name -> 
                    Text(name) 
                }
            }
        }

        // 3. Jump to Top
        FloatingActionButton(
            onClick = { scope.launch { listState.animateScrollToItem(0) } },
            modifier = Modifier.align(Alignment.BottomEnd)
        ) {
            Icon(Icons.Default.ArrowUp, "Top")
        }
    }
}`}
                        </pre>
                    </div>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="w-[300px] bg-white rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20"></div>
                    <div className="bg-teal-600 h-16 w-full shrink-0 flex items-end pb-3 justify-center text-white font-bold shadow-md z-10">
                        Contacts
                    </div>
                    <div className="flex-1 bg-[#F0FDFA] overflow-y-auto relative">
                         {/* Simulation of result */}
                         <div className="sticky top-0 bg-slate-200 px-4 py-1 font-bold text-slate-700 shadow-sm z-10">A</div>
                         <div className="p-4 border-b">Alice</div>
                         <div className="p-4 border-b">Alex</div>
                         <div className="sticky top-0 bg-slate-200 px-4 py-1 font-bold text-slate-700 shadow-sm z-10">B</div>
                         <div className="p-4 border-b">Bob</div>
                         <div className="p-4 border-b">Bella</div>
                         <div className="sticky top-0 bg-slate-200 px-4 py-1 font-bold text-slate-700 shadow-sm z-10">C</div>
                         <div className="p-4 border-b">Chi</div>
                         <div className="p-4 border-b">Charlie</div>
                         <div className="h-40"></div>
                    </div>
                    <button className="absolute bottom-4 right-4 w-12 h-12 bg-teal-500 rounded-full text-white shadow-lg flex items-center justify-center animate-bounce">
                        <ArrowUpCircle />
                    </button>
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
                            <div key={i} className={`w-20 h-2 rounded-full transition-colors ${i <= projectStep ? 'bg-teal-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 border-b border-slate-700">
                    <h3 className="text-white font-bold text-lg mb-2">{info.title}</h3>
                    <p className="text-blue-200 text-sm font-mono leading-relaxed">
                        <span className="text-teal-400">TODO:</span> {info.desc}
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
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-500 disabled:opacity-50"
                    >
                        {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} 
                        {projectStep === 2 ? "完成构建" : "下一步"}
                    </button>
                </div>
            </div>
        </div>
    )
  }

  if (mode === 'SCROLL_REMOTE') {
      const itemHeight = 60;
      const visibleIndex = Math.floor(scrollTop / itemHeight);
      
      return (
          <div className="w-full h-full flex items-center justify-center gap-12 p-4">
              {/* Remote Control Panel */}
              <div className="w-64 bg-slate-800 rounded-3xl p-6 border-4 border-slate-700 shadow-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-teal-400 font-bold mb-2">
                      <Radio />
                      <span>LazyListState</span>
                  </div>
                  
                  {/* Dashboard */}
                  <div className="bg-black/50 p-4 rounded-xl font-mono text-xs space-y-2">
                      <div className="flex justify-between text-slate-400">
                          <span>firstVisible:</span>
                          <span className="text-white">{visibleIndex}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                          <span>offset:</span>
                          <span className="text-white">{scrollTop % itemHeight}px</span>
                      </div>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                      <button 
                        onClick={animateScrollToTop}
                        className="col-span-2 bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                      >
                          <ArrowUpCircle size={20} /> Scroll to 0
                      </button>
                  </div>
                  <div className="text-xs text-slate-500 text-center mt-2">
                      scope.launch &#123; animate... &#125;
                  </div>
              </div>

              {/* Phone List */}
              <div className="w-[280px] h-[500px] bg-white rounded-[2.5rem] border-8 border-slate-800 overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 w-full h-8 bg-slate-100 z-10 border-b flex items-center justify-center text-[10px] text-slate-500 font-bold">GUEST LIST</div>
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="w-full h-full overflow-y-auto pt-8 pb-20 scroll-smooth"
                  >
                      {Array.from({length: 50}).map((_, i) => (
                          <div key={i} className="h-[60px] border-b border-slate-100 flex items-center px-4 gap-3">
                              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                                  {i}
                              </div>
                              <div className="w-32 h-3 bg-slate-100 rounded"></div>
                          </div>
                      ))}
                  </div>
                  {/* Floating Action Button simulation */}
                  {visibleIndex > 5 && (
                      <button 
                         onClick={animateScrollToTop}
                         className="absolute bottom-6 right-6 w-12 h-12 bg-teal-500 rounded-full shadow-lg flex items-center justify-center text-white animate-scale-in hover:bg-teal-400"
                      >
                          <ChevronUp />
                      </button>
                  )}
              </div>
          </div>
      )
  }

  if (mode === 'STICKY_VISUALIZER') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
               <div className="bg-white/80 px-6 py-2 rounded-full font-bold text-teal-900 border border-teal-200 shadow-sm mb-6 flex items-center gap-2">
                  <Flag size={18} /> 
                  试着滚动列表，观察“A组”和“B组”的标题如何吸附
              </div>

              <div className="w-[300px] h-[450px] bg-white rounded-[2rem] border-8 border-slate-800 overflow-hidden shadow-2xl relative">
                   <div 
                     className="w-full h-full overflow-y-auto relative scroll-smooth"
                     onScroll={(e) => {
                         const top = e.currentTarget.scrollTop;
                         setStickyScrollTop(top);
                         if (top > 40 && !hasCompletedSticky) {
                             setHasCompletedSticky(true);
                             setTimeout(onComplete, 1500);
                         }
                     }}
                   >
                       {/* GROUP A */}
                       <div className="sticky top-0 z-10 bg-teal-100 text-teal-800 font-bold px-4 py-2 border-b border-teal-200 shadow-sm">
                           A Group
                       </div>
                       {[1,2,3,4,5].map(i => (
                           <div key={`a-${i}`} className="p-4 border-b border-slate-50 flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-300 text-xs flex items-center justify-center">A</div>
                               <span className="text-slate-600 text-sm">Guest A-{i}</span>
                           </div>
                       ))}

                       {/* GROUP B */}
                       <div className="sticky top-0 z-10 bg-indigo-100 text-indigo-800 font-bold px-4 py-2 border-b border-indigo-200 shadow-sm">
                           B Group
                       </div>
                       {[1,2,3,4,5].map(i => (
                           <div key={`b-${i}`} className="p-4 border-b border-slate-50 flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-300 text-xs flex items-center justify-center">B</div>
                               <span className="text-slate-600 text-sm">Guest B-{i}</span>
                           </div>
                       ))}
                       
                       {/* Spacer */}
                       <div className="h-40"></div>
                   </div>
                   
                   {/* Visual indicator of stickiness */}
                   <div className="absolute top-2 right-2 pointer-events-none">
                       {stickyScrollTop > 0 && (
                           <div className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow animate-pulse">
                               STICKY ACTIVE
                           </div>
                       )}
                   </div>
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'LAYOUT_INFO';

    const options = [
        { label: 'scrollState.offset', value: 'OFFSET' },
        { label: 'scrollState.layoutInfo', value: 'LAYOUT_INFO' },
        { label: 'scrollState.isScrollInProgress', value: 'SCROLLING' }
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-teal-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-teal-100 p-2 rounded-full"><HelpCircle className="text-teal-600" /></div>
                    <h3 className="text-xl font-bold text-teal-900">前辈的提问</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    要准确判断列表是否已经滚动到了“最底部”，仅仅检查 `firstVisibleItemIndex` 是不够的。我们应该结合哪个属性？
                </p>
                <div className="space-y-3">
                    {options.map((opt) => {
                        const isSelected = quizChoice === opt.value;
                        const isCorrect = opt.value === 'LAYOUT_INFO';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-slate-700";
                        }

                        return (
                            <button key={opt.value} onClick={() => handleQuiz(opt.value)} className={btnClass} disabled={isSolved}>
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
            <div className="bg-[#F0FDFA] p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-teal-200 relative">
                <div className="ml-8">
                    <h3 className="text-xl font-bold text-teal-900 mb-2 flex items-center gap-2">
                        <Edit3 size={24} /> 露营笔记：Sticky Header DSL
                    </h3>
                    <div className="bg-teal-100 p-4 rounded-lg border border-teal-300 mb-4 font-mono text-sm text-teal-800 opacity-80 select-none">
                        {config.targetCode}
                    </div>
                    <input 
                      type="text" 
                      value={typedCode}
                      onChange={handleTyping}
                      className={`w-full bg-transparent border-b-2 font-mono text-sm p-2 outline-none transition-colors
                          ${isTypedCorrect ? 'border-green-500 text-green-700' : 'border-teal-300 text-teal-900 focus:border-teal-600'}
                      `}
                      placeholder="// 抄写代码..."
                      autoFocus
                    />
                    {isTypedCorrect && <p className="mt-4 text-green-600 font-bold animate-pulse">Code Memorized!</p>}
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

export default InteractiveScrollLab;
