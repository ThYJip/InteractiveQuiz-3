
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: THE STORM (SIDE EFFECT CRISIS) ---
  {
    id: 1,
    speaker: "Rin",
    text: "今晚风好大……我想煮杯咖啡，可是火刚点着就被风吹灭了，不得不重新点。一直重复，水根本烧不开。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛在狂风中试图点燃篝火，火柴划了一根又一根，但火苗瞬间熄灭。背景是呼啸的树林。"
    }
  },
  {
    id: 2,
    speaker: "Sensei",
    text: "在 Compose 中，这就叫“副作用泄漏”。如果把网络请求直接写在函数体里，每次界面刷新（重组/刮风），请求就会重新发送。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 危险写法：直接在 Composable 中写逻辑
@Composable
fun UserProfile(userId: String) {
    // ⚠️ 每次重组都会执行！
    // 如果界面一秒刷新 60 次，你就发了 60 个请求！
    api.fetchUser(userId) 
    
    Text("Hello")
}`
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "太可怕了！服务器会被我们点火烧掉的！快让我看看会发生什么！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'STORM_CRISIS' }
    }
  },

  // --- ACT 2: THE SHELTER (LAUNCHED EFFECT) ---
  {
    id: 4,
    speaker: "Rin",
    text: "我们需要一个防风罩。`LaunchedEffect` 就是那个罩子。它保证代码只在“进入帐篷”（进入组合）时执行一次，不管外面风多大。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 安全写法：LaunchedEffect
@Composable
fun UserProfile(userId: String) {
    // 🛡️ 防风罩：只在第一次进入时执行
    // Unit 是 Key，表示“永远不变”，所以不重启
    LaunchedEffect(Unit) {
        api.fetchUser(userId)
    }
    
    Text("Hello")
}`
    }
  },
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "只要加了防风罩，火就能稳定燃烧了！我们来修复它！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SHELTER_FIX' }
    }
  },

  // --- ACT 3: THE KEY ---
  {
    id: 6,
    speaker: "Rin",
    text: "但是，如果我想换一种咖啡豆（userId 变了），我就得熄火重煮。这就需要用到 Key。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'KEY_RELOAD' }
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 7,
    speaker: "Sensei",
    text: "考考你。如果我希望每次 userId 变化时都重新请求数据，LaunchedEffect 的 key 应该填什么？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: TYPING ---
  {
    id: 8,
    speaker: "Nadeshiko",
    text: "原来如此！Key 就是重启的开关！我要把这个“防风咒语”抄下来！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "LaunchedEffect(key1 = userId) { fetchData() }"
      }
    }
  },

  // --- ACT 6: SUMMARY ---
  {
    id: 9,
    speaker: "Rin",
    text: "LaunchedEffect 是处理副作用的避风港。记住：生命周期感知、自动取消、受控重启。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 7: AI ASSIGNMENT ---
  {
    id: 10,
    speaker: "Rin",
    text: "最后的试炼。写一个倒计时功能。每秒更新一次 `timeLeft`。记得使用 `delay`。小心，别让它在重组时乱跑。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `LaunchedEffect(Unit)` 启动一个协程。在里面写一个 `while(true)` 循环，每次 `delay(1000)` 后更新 `timeLeft` 状态。"
      }
    }
  },

  // --- ACT 8: VICTORY ---
  {
    id: 11,
    speaker: "Nadeshiko",
    text: "咖啡煮好啦！香喷喷的！再大的风也不怕了！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
