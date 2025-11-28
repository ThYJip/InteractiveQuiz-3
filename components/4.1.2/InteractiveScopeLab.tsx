import React, { useState, useEffect, useRef } from 'react';
import { InteractiveState } from './types';
import { Droplets, Axe, XCircle, Play, Box, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface Props {
  config: InteractiveState;
  onComplete: () => void;
}

interface Task {
  id: number;
  name: string;
  icon: React.ReactNode;
  progress: number;
  status: 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'LEAKING';
}

interface Feedback {
    code: string;
    explanation: string;
    whyGoodOrBad: string; // explicitly separating the "Why"
    type: 'INFO' | 'DANGER' | 'SUCCESS';
}

const InteractiveScopeLab: React.FC<Props> = ({ config, onComplete }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scopeActive, setScopeActive] = useState(false);
  const [leaked, setLeaked] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ 
      code: '// 等待操作...', 
      explanation: '请依照指示操作上方按钮', 
      whyGoodOrBad: '',
      type: 'INFO' 
  });
  const taskRef = useRef<number>(0);

  // Task Runner Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.status === 'RUNNING' || t.status === 'LEAKING') {
          // Chaos logic: if we "left" the component but tasks are running -> LEAK
          if (config.mode === 'CHAOS' && leaked && t.status === 'RUNNING') {
            return { ...t, status: 'LEAKING', progress: (t.progress + 5) % 100 };
          }
          // Structured logic: if cancelled, stop updating
          // The check for CANCELLED is unreachable here because of the outer if condition.
          // if (t.status === 'CANCELLED') return t;

          return { ...t, progress: (t.progress + 2) % 100 };
        }
        return t;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [config.mode, leaked]);

  // Check for completion
  useEffect(() => {
    if (config.mode === 'CHAOS' && leaked && tasks.some(t => t.status === 'LEAKING')) {
        setTimeout(onComplete, 4000); 
    }
  }, [leaked, tasks, config.mode, onComplete]);

  const addTask = (name: string, icon: React.ReactNode) => {
    const newTask: Task = {
      id: taskRef.current++,
      name,
      icon,
      progress: 0,
      status: 'RUNNING'
    };
    setTasks(prev => [...prev, newTask]);

    if (config.mode === 'CHAOS') {
        setFeedback({
            code: `GlobalScope.launch {\n  // 😭 孤儿任务\n  ${name === '烧水' ? 'boilWater()' : 'chopWood()'}\n}`,
            explanation: '你使用了 GlobalScope 来启动协程。',
            whyGoodOrBad: '❌ 为什么不好：GlobalScope 创建的协程没有父级，它的生命周期绑定整个应用程序。即使你退出了当前界面，这个任务依然在后台占用资源，你无法轻易找到并取消它。',
            type: 'DANGER'
        });
    } else {
        setFeedback({
            code: `campScope.launch {\n  // 👶 有家长的任务\n  ${name === '烧水' ? 'boilWater()' : 'chopWood()'}\n}`,
            explanation: '你在 campScope 作用域内启动了协程。',
            whyGoodOrBad: '✅ 为什么好：这个协程现在是 campScope 的“孩子”。只要控制了 campScope，就能控制所有在这个作用域下启动的任务。',
            type: 'SUCCESS'
        });
    }
  };

  const handleSimulateLeave = () => {
    setLeaked(true);
    setFeedback({
        code: `// Activity.onDestroy()\n// 😱 没有任何取消代码被执行!`,
        explanation: '你离开了页面（Activity/Fragment 销毁），但没有代码去停止那些 GlobalScope 任务。',
        whyGoodOrBad: '❌ 严重后果：这就是内存泄漏 (Memory Leak)。任务持有旧的上下文引用，导致内存无法释放，电量被消耗，甚至导致应用崩溃。',
        type: 'DANGER'
    });
  };

  const handleCancelScope = () => {
    setScopeActive(false);
    setTasks(prev => prev.map(t => ({ ...t, status: 'CANCELLED' })));
    setFeedback({
        code: `campScope.cancel()\n// 👏 一键清理`,
        explanation: '你调用了作用域的 cancel() 方法。',
        whyGoodOrBad: '✅ 为什么好：结构化并发的魅力在于“级联取消”。你不需要手忙脚乱地去停止每一个任务，父作用域取消时，所有子任务自动收到取消信号并停止。',
        type: 'SUCCESS'
    });
    setTimeout(onComplete, 3000);
  };

  useEffect(() => {
    setTasks([]);
    setLeaked(false);
    setScopeActive(config.mode === 'STRUCTURED');
    setFeedback({ 
        code: config.mode === 'CHAOS' ? '// 准备：GlobalScope 模式' : '// 准备：Structured Concurrency 模式',
        explanation: config.mode === 'CHAOS' ? '请尝试启动任务，然后直接“离开营地”。' : '启动任务，最后点击“scope.cancel()”来结束。',
        whyGoodOrBad: '',
        type: 'INFO'
    });
  }, [config]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 md:p-4 bg-slate-800/80 rounded-xl border border-white/10 relative overflow-hidden backdrop-blur-sm">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col h-full gap-2 md:gap-4">
        
        {/* TOP: Controls */}
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center p-3 bg-slate-900/60 rounded-xl shrink-0 shadow-lg border border-white/5">
            {scopeActive && (
               <div className="bg-camp-sensei text-white px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  <Box size={16} /> CAMP SCOPE ACTIVE
               </div>
            )}
            
            <button 
                onClick={() => addTask('烧水', <Droplets size={18} />)}
                disabled={!scopeActive && config.mode === 'STRUCTURED'}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm"
            >
                <Play size={16} fill="currentColor" /> 启动: 烧水
            </button>
            <button 
                onClick={() => addTask('劈柴', <Axe size={18} />)}
                disabled={!scopeActive && config.mode === 'STRUCTURED'}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white rounded-lg transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm"
            >
                 <Play size={16} fill="currentColor" /> 启动: 劈柴
            </button>
        </div>

        {/* MIDDLE: Visualization Area */}
        <div className={`relative flex-1 min-h-[140px] p-4 rounded-xl transition-all duration-500 border-2 overflow-y-auto ${scopeActive ? 'border-camp-sensei/50 bg-camp-sensei/5' : 'border-slate-600/50 bg-slate-900/40'}`}>
            {scopeActive && <div className="absolute top-0 left-0 bg-camp-sensei text-[10px] text-white px-2 py-0.5 rounded-br opacity-80">CoroutineScope Context</div>}
            
            <div className="flex flex-wrap gap-4 justify-center pt-4">
                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-white/30 h-full mt-4">
                        <Box size={40} className="mb-2 opacity-50"/>
                        <span className="italic text-sm">暂无任务运行中...</span>
                    </div>
                )}
                {tasks.map(task => (
                    <div key={task.id} className={`
                        relative w-24 h-24 flex flex-col items-center justify-center rounded-lg border 
                        transition-all duration-300 shadow-xl
                        ${task.status === 'LEAKING' ? 'border-red-500 bg-red-500/20 animate-[bounce_1s_infinite]' : ''}
                        ${task.status === 'CANCELLED' ? 'border-gray-600 bg-gray-800 opacity-60 grayscale scale-95' : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5'}
                    `}>
                        <div className={`mb-2 text-white ${task.status === 'RUNNING' || task.status === 'LEAKING' ? 'animate-pulse' : ''}`}>
                            {task.icon}
                        </div>
                        <span className="text-[10px] font-mono text-white/90 mb-1.5">{task.name}</span>
                        {task.status !== 'CANCELLED' && (
                             <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div className={`h-full ${task.status === 'LEAKING' ? 'bg-red-500' : 'bg-camp-rin'}`} style={{ width: `${task.progress}%` }}></div>
                             </div>
                        )}
                        {task.status === 'LEAKING' && <span className="absolute -top-2 -right-2 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm z-10">LEAK!</span>}
                        {task.status === 'CANCELLED' && <span className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px] text-red-300 font-bold rotate-12 text-xs rounded-lg border border-red-500/30">CANCELLED</span>}
                    </div>
                ))}
            </div>
        </div>

        {/* BOTTOM: Code Feedback & Actions */}
        <div className="flex flex-col gap-3">
             {/* Educational Feedback Panel */}
             <div className={`w-full rounded-xl border-l-4 p-4 shadow-lg transition-all duration-300 flex gap-4
                ${feedback.type === 'DANGER' ? 'bg-red-950/40 border-red-500 text-red-100' : ''}
                ${feedback.type === 'SUCCESS' ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100' : ''}
                ${feedback.type === 'INFO' ? 'bg-slate-900/60 border-blue-400 text-blue-100' : ''}
             `}>
                 <div className="shrink-0 pt-1">
                     {feedback.type === 'DANGER' && <AlertTriangle className="text-red-500" size={24} />}
                     {feedback.type === 'SUCCESS' && <CheckCircle2 className="text-emerald-500" size={24} />}
                     {feedback.type === 'INFO' && <Info className="text-blue-400" size={24} />}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                     <div className="flex flex-col md:flex-row md:items-start gap-4 mb-2">
                        {/* The Code */}
                        <div className="flex-1 font-mono text-xs md:text-sm bg-black/30 p-2 rounded border border-white/10 overflow-x-auto whitespace-pre">
                            {feedback.code}
                        </div>
                     </div>
                     
                     {/* The Explanation */}
                     <div className="space-y-1">
                        <p className="font-bold text-sm md:text-base opacity-90">{feedback.explanation}</p>
                        {feedback.whyGoodOrBad && (
                            <p className="text-xs md:text-sm opacity-80 leading-relaxed p-2 rounded bg-black/10 mt-1 border border-white/5">
                                {feedback.whyGoodOrBad}
                            </p>
                        )}
                     </div>
                 </div>
             </div>

            {/* Critical Action Buttons */}
            <div className="flex justify-center py-2">
                {config.mode === 'CHAOS' && !leaked && (
                    <button 
                    onClick={handleSimulateLeave}
                    className="group relative px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/20 transform transition active:scale-95 flex items-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">🏃‍♀️ 离开营地 (无视任务)</span>
                </button>
                )}

                {config.mode === 'STRUCTURED' && scopeActive && (
                    <button 
                    onClick={handleCancelScope}
                    className="group relative px-6 py-3 bg-camp-nadeshiko hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/20 transform transition active:scale-95 flex items-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2"><XCircle size={20} /> 执行 scope.cancel()</span>
                </button>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default InteractiveScopeLab;