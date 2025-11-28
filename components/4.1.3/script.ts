
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: NOISE POLLUTION (CRISIS) ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "啊，露营的早晨！我想一边在帐篷里整理东西，一边听“露营电台”的广播。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "Nadeshiko 钻进帐篷，打开一个复古收音机。背景是清晨的露营地，阳光洒在帐篷上。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "可是……每次我钻进帐篷（进入组合），收音机就会多开一台！我进进出出几次，现在帐篷里吵死了！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'NOISE_POLLUTION' }
    }
  },
  
  // --- ACT 2: CLEANUP THEORY ---
  {
    id: 3,
    speaker: "Rin",
    text: "你忘了“清理契约”。在 Compose 中，注册了资源（如广播监听），必须在离开时注销。否则，资源会越积越多，导致内存泄漏。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 错误：只注册，不清理
@Composable
fun RadioTent() {
    // 每次进入都注册一个新的监听器
    // 离开时却没人管它！
    radioManager.register(listener)
    
    // ...
}`
    }
  },
  {
    id: 4,
    speaker: "Rin",
    text: "我们需要 `DisposableEffect`。它不仅允许你在进入时执行逻辑，还强制你提供一个 `onDispose` 代码块，在离开时自动清理。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 正确：有借有还
DisposableEffect(Unit) {
    // 1. 进入时：打开收音机
    radioManager.register(listener)

    // 2. 离开时：必须清理！
    onDispose {
        radioManager.unregister(listener)
    }
}`
    }
  },

  // --- ACT 3: CLEANUP FIX ---
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "原来如此！就像离开帐篷时要关灯一样！那我给收音机装个自动开关（DisposableEffect）试试！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'CLEANUP_FIX' }
    }
  },

  // --- ACT 4: CHANNEL SURFING (KEYS) ---
  {
    id: 6,
    speaker: "Rin",
    text: "如果你想换台（Key 变化），Compose 会先切断旧频道（执行旧的 onDispose），再连接新频道。顺序非常重要。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'CHANNEL_SURF' }
    }
  },

  // --- ACT 5: QUIZ ---
  {
    id: 7,
    speaker: "Sensei",
    text: "考考你。当 `key` 发生变化时，Compose 的执行顺序是怎样的？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 6: TYPING ---
  {
    id: 8,
    speaker: "Nadeshiko",
    text: "先清理旧的，再建立新的！这个逻辑太棒了，绝对不会串台！我要把这个关键函数 `onDispose` 记下来。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "onDispose { manager.unregister(listener) }"
      }
    }
  },

  // --- ACT 7: SUMMARY ---
  {
    id: 9,
    speaker: "Sensei",
    text: "DisposableEffect 是处理非 Compose 资源（如广播、传感器、原生 View）的桥梁。记住：有借有还，再借不难。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 8: AI ASSIGNMENT ---
  {
    id: 10,
    speaker: "Rin",
    text: "最后的试炼。写一个监听生命周期的功能。获取 `LocalLifecycleOwner.current`，并注册一个观察者。别忘了在 `onDispose` 里移除它。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `DisposableEffect` 监听 `lifecycleOwner`。在 Effect 块内添加 observer，在 onDispose 块内移除 observer。"
      }
    }
  },

  // --- ACT 9: VICTORY ---
  {
    id: 11,
    speaker: "Nadeshiko",
    text: "太棒了！现在我可以安安静静地听广播，再也不会有噪音干扰啦！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
