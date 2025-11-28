import React, { useState, useMemo } from 'react';
import { script } from './script';
import StageLayer from './StageLayer';
import DialogLayer from './DialogLayer';
import VictoryScreen from './VictoryScreen';
import { Home } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

const GameEngine: React.FC<Props> = ({ onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [labCompleted, setLabCompleted] = useState(false);

  const currentStep = useMemo(() => script[currentStepIndex], [currentStepIndex]);
  const isLastStep = currentStepIndex === script.length - 1;

  // Determine if we can show the "Next" button
  const canProceed = useMemo(() => {
    if (currentStep.viewType === 'INTERACTIVE_LAB') {
        return labCompleted;
    }
    return true; // For Image/Code/Victory, always allow next (unless it's the very end)
  }, [currentStep, labCompleted]);

  const handleNext = () => {
    if (isLastStep) return;
    
    setLabCompleted(false); // Reset for next potential lab
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleInteractiveComplete = () => {
    setLabCompleted(true);
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Back Button (Cyber Style) */}
      {onBack && (
        <button 
          onClick={onBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-cyan-900/50 border border-white/10 hover:border-cyan-400/50 rounded-lg text-slate-300 hover:text-cyan-200 transition-all backdrop-blur-md shadow-lg group"
        >
          <Home size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono font-bold">返回大厅</span>
        </button>
      )}

      {/* Top Layer: Stage */}
      <StageLayer 
        step={currentStep} 
        onInteractiveComplete={handleInteractiveComplete} 
      />

      {/* FX Layer */}
      {currentStep.viewType === 'VICTORY' && <VictoryScreen />}

      {/* Bottom Layer: Narrative */}
      <DialogLayer 
        speaker={currentStep.speaker} 
        text={currentStep.text} 
        onNext={handleNext} 
        canProceed={canProceed && !(isLastStep && currentStep.viewType === 'VICTORY')} 
      />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
         <h1 className="text-6xl font-black text-camp-wood tracking-tighter">YURU CAMP</h1>
         <p className="text-right font-mono text-xl">CODE CHRONICLES</p>
      </div>
    </div>
  );
};

export default GameEngine;