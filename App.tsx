
import React, { useState } from 'react';
import GameEngineScope from './components/4.1.2/GameEngine';
import GameEngineHoisting from './components/2.4.2/GameEngine';
import GameEngineRemember from './components/2.3.1/GameEngine';
import GameEngineConfig from './components/2.3.2/GameEngine';
import GameEngineLazy from './components/3.1.1/GameEngine';
import GameEngineHetero from './components/3.1.2/GameEngine';
import GameEngineScroll from './components/3.1.3/GameEngine';
import GameEngineSlot from './components/3.2.1/GameEngine';
import GameEngineScaffold from './components/3.2.2/GameEngine';
import GameEngineInput from './components/3.3.1/GameEngine';
import GameEngineButton from './components/3.3.2/GameEngine';
import GameEngineImage from './components/3.3.3/GameEngine';
import GameEngineEffect from './components/4.1.1/GameEngine';
import GameEngineCleanup from './components/4.1.3/GameEngine';
import GameEngineManual from './components/4.2.1/GameEngine';
import GameEngineDerived from './components/4.2.2/GameEngine';
import GameEngineViewModel from './components/4.3.1/GameEngine';
import Lobby from './components/Lobby';

type View = 'LOBBY' | '4.1.1' | '4.1.2' | '4.1.3' | '4.2.1' | '4.2.2' | '4.3.1' | '2.4.2' | '2.3.1' | '2.3.2' | '3.1.1' | '3.1.2' | '3.1.3' | '3.2.1' | '3.2.2' | '3.3.1' | '3.3.2' | '3.3.3';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('LOBBY');

  const renderView = () => {
    switch (currentView) {
      case '4.1.1':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#EEF2FF] text-slate-800 selection:bg-indigo-300 selection:text-white">
            <GameEngineEffect onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '4.1.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white">
            <GameEngineScope onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '4.1.3':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#F7FEE7] text-slate-800 selection:bg-lime-300 selection:text-lime-900">
            <GameEngineCleanup onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '4.2.1':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
            <GameEngineManual onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '4.2.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#F0FDF4] text-slate-800 selection:bg-green-300 selection:text-green-900">
            <GameEngineDerived onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '4.3.1':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#FFF7ED] text-slate-800 selection:bg-orange-300 selection:text-orange-900">
            <GameEngineViewModel onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '2.4.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#FFF8E1] text-slate-800 selection:bg-orange-300 selection:text-white">
            <GameEngineHoisting onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '2.3.1':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#F1F8E9] text-slate-800 selection:bg-green-300 selection:text-white">
            <GameEngineRemember onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '2.3.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#F1F8E9] text-slate-800 selection:bg-emerald-300 selection:text-white">
            <GameEngineConfig onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.1.1':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#FFF3E0] text-slate-800 selection:bg-amber-300 selection:text-white">
            <GameEngineLazy onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.1.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#EEF2FF] text-slate-800 selection:bg-indigo-300 selection:text-white">
            <GameEngineHetero onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.1.3':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#E0F2F1] text-slate-800 selection:bg-teal-300 selection:text-white">
            <GameEngineScroll onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.2.1':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#F3E8FF] text-slate-800 selection:bg-purple-300 selection:text-white">
            <GameEngineSlot onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.2.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#EFF6FF] text-slate-800 selection:bg-blue-300 selection:text-white">
            <GameEngineScaffold onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.3.1':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#FDF2F8] text-slate-800 selection:bg-pink-300 selection:text-white">
            <GameEngineInput onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.3.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#FEF2F2] text-slate-800 selection:bg-red-300 selection:text-white">
            <GameEngineButton onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      case '3.3.3':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-[#ECFEFF] text-slate-800 selection:bg-cyan-300 selection:text-white">
            <GameEngineImage onBack={() => setCurrentView('LOBBY')} />
          </div>
        );
      default:
        return <Lobby onSelectLesson={(id) => setCurrentView(id as View)} />;
    }
  };

  return (
    <>
      {renderView()}
    </>
  );
};

export default App;
