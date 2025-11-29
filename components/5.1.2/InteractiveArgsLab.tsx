
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Package, MapPin, Truck, AlertTriangle, CheckCircle2, Search, HelpCircle, Terminal, Sparkles, XCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveArgsLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB 1 & 2: ADDRESS LAB ===
  const [addressInput, setAddressInput] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<'IDLE' | 'SHIPPING' | 'CRASH' | 'SUCCESS'>('IDLE');
  const [errorMsg, setErrorMsg] = useState("");
  const [failCount, setFailCount] = useState(0);

  // === LAB 3: OPTIONAL NOTES ===
  const [queryInput, setQueryInput] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [hasTriedEmpty, setHasTriedEmpty] = useState(false);
  const [hasTriedValue, setHasTriedValue] = useState(false);

  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === AI ===
  const [userCode, setUserCode] = useState("composable(\n  route = \"...\",\n  arguments = listOf(...)\n) { ... }");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);


  // --- LOGIC: ADDRESS LAB ---
  const handleSendPackage = () => {
      if (deliveryStatus !== 'IDLE') return;
      
      setDeliveryStatus('SHIPPING');
      
      setTimeout(() => {
          if (mode === 'ADDRESS_FAIL') {
              // Fail scenario: Input is empty or just "/"
              if (!addressInput || addressInput.trim() === "") {
                  setDeliveryStatus('CRASH');
                  setErrorMsg("IllegalArgumentException: Navigation destination not found");
                  setTimeout(onComplete, 3000); // Proceed after crash
              } else {
                  // User technically shouldn't be able to fix it in this mode, but if they do...
                  setDeliveryStatus('SUCCESS');
                  setTimeout(onComplete, 2000);
              }
          } else {
              // Success scenario: Needs ID
              if (addressInput.trim().length > 0) {
                  setDeliveryStatus('SUCCESS');
                  setTimeout(onComplete, 2000);
              } else {
                  setDeliveryStatus('CRASH');
                  setErrorMsg("参数缺失! 必须提供 ID");
                  setFailCount(c => c + 1);
                  
                  // Auto-reset and help user if stuck
                  setTimeout(() => {
                      setDeliveryStatus('IDLE');
                      // If user failed once in SUCCESS mode, auto-fill to help them proceed
                      setAddressInput("123");
                  }, 2500); 
              }
          }
      }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleSendPackage();
      }
  }

  // --- LOGIC: OPTIONAL NOTES ---
  const handleSearch = () => {
      const q = queryInput.trim();
      const result = q === "" ? "显示所有物品 (默认)" : `显示搜索结果: ${q}`;
      setSearchResult(result);

      if (q === "") setHasTriedEmpty(true);
      else setHasTriedValue(true);
  };

  useEffect(() => {
      if (hasTriedEmpty && hasTriedValue) {
          setTimeout(onComplete, 2000);
      }
  }, [hasTriedEmpty, hasTriedValue, onComplete]);


  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'CORRECT') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'WRONG_1': return { correct: false, text: "错误。{itemId} 是路径参数，必须跟在路径后面，不能用 ? 连接。" };
          case 'WRONG_2': return { correct: false, text: "错误。?showImage={showImage} 才是查询参数的正确写法。" };
          case 'CORRECT': return { correct: true, text: "正确！'details/{itemId}?showImage={showImage}' 完美结合了必选路径参数和可选查询参数。" };
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
                Check for correct route syntax "user/{id}?mode={mode}" and arguments definition with NavType.
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

  if (mode === 'ADDRESS_FAIL' || mode === 'ADDRESS_SUCCESS') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className={`relative w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center shadow-inner overflow-hidden transition-colors duration-500
                  ${deliveryStatus === 'CRASH' ? 'bg-red-100 border-red-400' : 'bg-sky-100 border-sky-300'}
              `}>
                  {deliveryStatus === 'IDLE' && <Package size={60} className="text-sky-600" />}
                  {deliveryStatus === 'SHIPPING' && <Truck size={60} className="text-sky-600 animate-bounce" />}
                  {deliveryStatus === 'CRASH' && <AlertTriangle size={60} className="text-red-600 animate-pulse" />}
                  {deliveryStatus === 'SUCCESS' && <CheckCircle2 size={60} className="text-green-600" />}
                  
                  {deliveryStatus === 'CRASH' && (
                      <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center p-4 text-center animate-fade-in">
                          <p className="text-white text-xs font-bold font-mono leading-relaxed">{errorMsg}</p>
                      </div>
                  )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
                  <div className="flex items-center gap-2 mb-4 bg-slate-100 p-2 rounded text-sm font-mono text-slate-600">
                      <span>navigate("profile/</span>
                      <input 
                        type="text" 
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={mode === 'ADDRESS_FAIL' ? "" : "123"}
                        disabled={mode === 'ADDRESS_FAIL' || deliveryStatus !== 'IDLE'}
                        className="bg-white border-b-2 border-sky-500 outline-none w-16 text-center text-sky-700 font-bold"
                        autoFocus={mode === 'ADDRESS_SUCCESS'}
                      />
                      <span>")</span>
                  </div>
                  
                  <button 
                    onClick={handleSendPackage}
                    disabled={deliveryStatus !== 'IDLE'}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${mode === 'ADDRESS_FAIL' ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'} text-white shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                      {deliveryStatus === 'SHIPPING' ? <><Loader2 className="animate-spin" /> 发送中...</> : '发送包裹'}
                  </button>
              </div>
              
              {mode === 'ADDRESS_FAIL' && (
                  <p className="text-slate-500 text-xs text-center">
                      提示：保持输入为空以触发崩溃。
                  </p>
              )}
              {mode === 'ADDRESS_SUCCESS' && (
                  <p className={`text-xs text-center transition-opacity duration-500 ${failCount > 0 ? 'text-red-500 opacity-100 animate-pulse' : 'text-slate-400 opacity-0'}`}>
                      {failCount > 0 ? "已为你自动填写 ID，请再次点击发送！" : "请输入 ID"}
                  </p>
              )}
          </div>
      )
  }

  if (mode === 'OPTIONAL_NOTES') {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
              <div className="bg-sky-50 p-6 rounded-3xl border-4 border-sky-200 w-full max-w-md flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center gap-2 text-sky-800 font-bold">
                      <Search /> 
                      <span>露营搜索</span>
                  </div>
                  
                  <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        placeholder="搜索..."
                        className="flex-1 p-3 rounded-xl border-2 border-sky-200 focus:border-sky-500 outline-none"
                      />
                      <button 
                        onClick={handleSearch}
                        className="bg-sky-500 text-white p-3 rounded-xl font-bold shadow hover:bg-sky-600 transition-colors"
                      >
                          GO
                      </button>
                  </div>

                  <div className="bg-white h-24 rounded-xl border border-slate-200 p-4 flex items-center justify-center text-center">
                      {searchResult ? (
                          <span className="text-slate-700 font-bold animate-fade-in">{searchResult}</span>
                      ) : (
                          <span className="text-slate-400 text-sm">结果将显示在这里...</span>
                      )}
                  </div>
              </div>

              <div className="flex gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${hasTriedEmpty ? 'bg-green-100 border-green-500 text-green-700' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                      {hasTriedEmpty ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                      <span className="text-xs font-bold">试用默认值 (空)</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${hasTriedValue ? 'bg-green-100 border-green-500 text-green-700' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                      {hasTriedValue ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                      <span className="text-xs font-bold">试用具体值</span>
                  </div>
              </div>
          </div>
      )
  }

  if (mode === 'QUIZ') {
    const feedback = getQuizFeedback();
    const isSolved = quizChoice === 'CORRECT';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-sky-100 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-sky-100 p-2 rounded-full"><HelpCircle className="text-sky-600" /></div>
                    <h3 className="text-xl font-bold text-sky-900">路由拼图</h3>
                </div>
                <p className="text-lg text-slate-700 font-medium mb-6">
                    必填参数 `itemId` + 可选参数 `showImage`，正确的 Route 是：
                </p>
                <div className="space-y-3">
                    {[
                        { val: 'WRONG_1', label: 'details?itemId={itemId}&showImage={showImage}' },
                        { val: 'WRONG_2', label: 'details/{itemId}/{showImage}' },
                        { val: 'CORRECT', label: 'details/{itemId}?showImage={showImage}' }
                    ].map((opt) => {
                        const isSelected = quizChoice === opt.val;
                        const isCorrect = opt.val === 'CORRECT';
                        
                        let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                        if (isSelected) {
                            btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                        } else {
                            btnClass += "bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700";
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
            <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-sky-700">
                <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2 text-sky-400 font-mono text-sm font-bold">
                        <Terminal size={18} /> 凛的试炼场
                    </div>
                </div>
                <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                    <p className="text-sky-200 text-sm font-mono"><span className="text-sky-400">#</span> {config.assignmentPrompt}</p>
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
                        <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-sky-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-sky-500">
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

export default InteractiveArgsLab;
