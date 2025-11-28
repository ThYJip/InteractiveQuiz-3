
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
    <div className="w-full h-full flex flex-col relative bg-slate-950 text-cyan-50">
      {/* Back Button (Cyber Style) */}
      {onBack && (
        <button 
          onClick={onBack}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 bg-slate-900/90 hover:bg-cyan-900/50 border-2 border-cyan-800 hover:border-cyan-500 rounded-lg text-cyan-400 hover:text-cyan-200 transition-all shadow-lg group font-mono"
        >
          <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-wide">EXIT_DECK</span>
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
      <div className="absolute top-8 right-8 text-right opacity-30 pointer-events-none select-none">
          <h2 className="text-4xl font-black text-cyan-900 tracking-tighter">COROUTINE COCKPIT</h2>
          <span className="font-mono text-cyan-800 tracking-widest text-xs">SYSTEM.READY</span>
      </div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
    </div>
  );
};

export default GameEngine;
