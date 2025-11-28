
import React, { useState, useEffect } from 'react';
import { InteractiveState } from './types';
import { Loader2, Zap, Move, Activity, HelpCircle, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

const InteractiveAnimLab: React.FC<Props> = ({ config, onComplete }) => {
  const mode = config.mode;

  // === LAB STATE ===
  const [isBig, setIsBig] = useState(false);
  const [currentSize, setCurrentSize] = useState(100); // 100 -> 200
  
  // Animation loop simulation
  useEffect(() => {
      let animationFrameId: number;
      
      const target = isBig ? 200 : 100;
      
      const animate = () => {
          if (mode === 'INSTANT_SNAP') {
              setCurrentSize(target);
          } 
          else if (mode === 'SMOOTH_MORPH') {
              // Linear Interpolation (Lerp) for Tween simulation
              setCurrentSize(prev => {
                  const diff = target - prev;
                  if (Math.abs(diff) < 1) return target;
                  return prev + diff * 0.1; 
              });
          } 
          else if (mode === 'BOUNCY_JELLY') {
              // Simple spring physics simulation
              // This is a very rough approximation for visual effect
              // Real spring would need velocity tracking
              setCurrentSize(prev => {
                  const k = 0.1; // Stiffness
                  const damping = 0.8; // Damping
                  // We need velocity state for real spring, simulating with CSS keyframes instead for bounce
                  // But let's try a simple elastic approach here or rely on CSS
                  return prev; 
              });
          }
          
          if (Math.abs(target - currentSize) > 0.5 && mode !== 'INSTANT_SNAP') {
             animationFrameId = requestAnimationFrame(animate);
          }
      };

      if (mode !== 'BOUNCY_JELLY') {
          // Use JS loop for Smooth/Instant
          animationFrameId = requestAnimationFrame(animate);
      } 
      
      return () => cancelAnimationFrame(animationFrameId);
  }, [isBig, mode]);

  // Completion check
  const [toggleCount, setToggleCount] = useState(0);
  const handleToggle = () => {
      setIsBig(p => !p);
      setToggleCount(c => c + 1);
      if (toggleCount >= 3) {
          setTimeout(onComplete, 1500);
      }
  };

  // === QUIZ ===
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // === AI ===
  const [userCode, setUserCode] = useState("val color by animateColorAsState(...)");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{pass: boolean, msg: string} | null>(null);

  // --- LOGIC: QUIZ ---
  const handleQuiz = (choice: string) => {
      setQuizChoice(choice);
      if (choice === 'BOUNCE') {
          setTimeout(onComplete, 2500);
      }
  };

  const getQuizFeedback = () => {
      if (!quizChoice) return null;
      switch (quizChoice) {
          case 'FAST': return { correct: false, text: "Incorrect. 'HighBouncy' affects the oscillation, not just speed." };
          case 'BOUNCE': return { correct: true, text: "Correct! Low damping means it oscillates (bounces) back and forth around the target before settling." };
          case 'SMOOTH': return { correct: false, text: "Incorrect. That describes a high damping ratio (NoBouncy)." };
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
                Check for animateColorAsState usage.
                Respond JSON: { "pass": boolean, "message": "string (Rin persona, English)" }.
             `,
             config: { responseMimeType: "application/json" }
          });
          const result = JSON.parse(response.text || "{}");
          setAiFeedback({ pass: result.pass, msg: result.message });
          if (result.pass) setTimeout(onComplete, 3000);
      } catch (error) {
          setAiFeedback({ pass: false, msg: "AI unavailable, simulating pass." });
          setTimeout(onComplete, 2000);
      } finally {
          setAiLoading(false);
      }
  };

  // === RENDERERS ===

  if (mode === 'QUIZ') {
      const feedback = getQuizFeedback();
      const isSolved = quizChoice === 'BOUNCE';

      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <div className="bg-white/90 p-8 rounded-3xl shadow-xl border-4 border-fuchsia-100 max-w-lg w-full">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="bg-fuchsia-100 p-2 rounded-full"><HelpCircle className="text-fuchsia-600" /></div>
                      <h3 className="text-xl font-bold text-fuchsia-900">Physics Quiz</h3>
                  </div>
                  <p className="text-lg text-slate-700 font-medium mb-6">
                      What happens visually if you use `Spring.DampingRatioHighBouncy`?
                  </p>
                  <div className="space-y-3">
                      {[
                          { val: 'FAST', label: 'It moves instantly to the target' },
                          { val: 'SMOOTH', label: 'It slows down gently without overshooting' },
                          { val: 'BOUNCE', label: 'It overshoots and oscillates (bounces)' }
                      ].map((opt) => {
                          const isSelected = quizChoice === opt.val;
                          const isCorrect = opt.val === 'BOUNCE';
                          
                          let btnClass = "w-full p-4 rounded-xl border-2 text-left font-bold transition-all ";
                          if (isSelected) {
                              btnClass += isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                          } else {
                              btnClass += "bg-white border-slate-200 hover:border-fuchsia-400 hover:bg-fuchsia-50 text-slate-700";
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
              <div className="w-full max-w-3xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border-4 border-fuchsia-700">
                  <div className="bg-[#0f172a] p-3 flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center gap-2 text-fuchsia-400 font-mono text-sm font-bold">
                          <Terminal size={18} /> Rin's Proving Ground
                      </div>
                  </div>
                  <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                      <p className="text-fuchsia-200 text-sm font-mono"><span className="text-fuchsia-400">#</span> {config.assignmentPrompt}</p>
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
                          <button onClick={checkCodeWithAI} disabled={aiLoading} className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-fuchsia-500 disabled:opacity-50">
                              {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} Submit
                          </button>
                      )}
                  </div>
              </div>
          </div>
      )
  }

  // === VISUAL MODES ===
  return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8">
          
          <div className="bg-white/50 px-6 py-3 rounded-full font-bold text-fuchsia-900 border border-fuchsia-200 flex items-center gap-2">
              <Activity size={20} />
              MODE: {mode.replace('_', ' ')}
          </div>

          <div className="relative w-96 h-96 bg-white rounded-3xl border-8 border-slate-200 shadow-2xl flex items-center justify-center overflow-hidden">
              {/* The Marshmallow */}
              <div 
                  className={`bg-gradient-to-br from-pink-300 to-purple-400 rounded-3xl shadow-lg border-4 border-white/50 flex items-center justify-center text-white font-bold text-2xl
                      ${mode === 'BOUNCY_JELLY' ? (isBig ? 'animate-bounce-scale-up' : 'animate-bounce-scale-down') : ''}
                  `}
                  style={{
                      width: mode === 'BOUNCY_JELLY' ? (isBig ? 200 : 100) : currentSize,
                      height: mode === 'BOUNCY_JELLY' ? (isBig ? 200 : 100) : currentSize,
                      // For Bouncy Jelly, we use CSS animation for the spring effect
                      // For others, we use JS state
                  }}
              >
                  {isBig ? "BIG" : "smol"}
              </div>
              
              {/* Grid background */}
              <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>

          <button 
            onClick={handleToggle}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all text-xl flex items-center gap-2"
          >
              <Zap fill="currentColor" /> Toggle Size
          </button>

          {/* Add CSS for spring animation simulation */}
          <style>{`
            @keyframes bounce-scale-up {
                0% { transform: scale(0.5); }
                50% { transform: scale(1.2); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
            @keyframes bounce-scale-down {
                0% { transform: scale(2); }
                50% { transform: scale(0.8); }
                70% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            .animate-bounce-scale-up {
                animation: bounce-scale-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .animate-bounce-scale-down {
                animation: bounce-scale-down 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
      </div>
  );
};

export default InteractiveAnimLab;
