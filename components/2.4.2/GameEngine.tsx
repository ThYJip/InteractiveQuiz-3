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
    <div className="w-full h-full flex flex-col relative bg-[#FFF8E1]">
      {/* Back Button (Cozy Style) */}
      {onBack && (
        <button 
          onClick={onBack}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 bg-white/90 hover:bg-orange-50 border-2 border-orange-100 hover:border-orange-200 rounded-2xl text-orange-800/80 hover:text-orange-600 transition-all shadow-sm hover:shadow-md group"
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
        canProceed={canProceed && !(isLastStep && currentStep.viewType === 'VICTORY')} 
      />
      
      {/* Background Decor - Minimalist Landscape */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-orange-100 to-transparent -z-10 pointer-events-none opacity-50"></div>
      <div className="absolute top-8 right-8 text-right opacity-30 pointer-events-none select-none">
          <h2 className="text-4xl font-black text-orange-900/40">CHAPTER 2</h2>
          <span className="font-mono text-orange-800/40 tracking-widest">STATE HOISTING</span>
      </div>
    </div>
  );
};

export default GameEngine;