
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

  const canProceed = useMemo(() => {
    if (currentStep.viewType === 'INTERACTIVE_LAB') {
        return labCompleted;
    }
    return true; 
  }, [currentStep, labCompleted]);

  const handleNext = () => {
    if (isLastStep) return;
    setLabCompleted(false); 
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleInteractiveComplete = () => {
    setLabCompleted(true);
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-[#F5F3FF]">
      {/* Back Button (Violet Style) */}
      {onBack && (
        <button 
          onClick={onBack}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 bg-white/90 hover:bg-violet-50 border-2 border-violet-200 hover:border-violet-300 rounded-2xl text-violet-800/80 hover:text-violet-700 transition-all shadow-sm hover:shadow-md group"
        >
          <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-wide">返回大厅</span>
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
        canProceed={canProceed}
        isLastStep={isLastStep}
        onHome={onBack}
      />
      
      {/* Background Decor */}
      <div className="absolute top-8 right-8 text-right opacity-20 pointer-events-none select-none">
          <h2 className="text-4xl font-black text-violet-900/60">CHAPTER 4.3.2</h2>
          <span className="font-mono text-violet-800/60 tracking-widest">STATE MODELING</span>
      </div>
    </div>
  );
};

export default GameEngine;
