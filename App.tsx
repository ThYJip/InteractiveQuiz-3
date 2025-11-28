import React, { useState } from 'react';
import GameEngineScope from './components/4.1.2/GameEngine';
import GameEngineHoisting from './components/2.4.2/GameEngine';
import GameEngineRemember from './components/2.3.1/GameEngine';
import Lobby from './components/Lobby';

type View = 'LOBBY' | '4.1.2' | '2.4.2' | '2.3.1';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('LOBBY');

  const renderView = () => {
    switch (currentView) {
      case '4.1.2':
        return (
          <div className="w-full h-screen relative overflow-hidden bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white">
            <GameEngineScope onBack={() => setCurrentView('LOBBY')} />
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