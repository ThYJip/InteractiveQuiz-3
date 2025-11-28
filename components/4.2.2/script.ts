
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: HIKING CRISIS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "今天要爬山去看富士山！每走一步我都要确认一下是不是到了！呼……呼……好累啊！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "Nadeshiko 满头大汗地爬山，每走一步就大喊一声“到了吗？”，看起来筋疲力尽。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "你这样太浪费体力了。这就是直接读取高频状态的后果。每一步（像素）都在触发你的反应（重组），实际上你只需要知道“是否到达山顶”。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 累死人的写法
val listState = rememberLazyListState()

// ❌ 错误：直接读取 firstVisibleItemIndex
// 每次滚动 1 像素，这里就变一次，整个页面重组一次！
val showButton = listState.firstVisibleItemIndex > 0

if (showButton) { ... }`
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "原来是因为我喊得太频繁了吗？快让我体验一下这到底有多累！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'HIKING_EXHAUSTION' }
    }
  },

  // --- ACT 2: BINOCULARS SOLUTION ---
  {
    id: 4,
    speaker: "Sensei",
    text: "你需要一副“望远镜”（derivedStateOf）。它能把频繁的脚步声过滤掉，只在风景真正改变（条件翻转）时通知你。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 省力写法：derivedStateOf
val listState = rememberLazyListState()

// 🔭 望远镜：只关注结果变化
// 只有当 (index > 0) 从 false 变 true (或反之) 时，才通知更新
val showButton by remember {
    derivedStateOf { listState.firstVisibleItemIndex > 0 }
}

if (showButton) { ... }`
    }
  },
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "用了望远镜之后，我就不用每一步都喊了？只有看到山顶才喊？太棒了，我要试试！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BINOCULARS_FIX' }
    }
  },

  // --- ACT 3: QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "考考你。`derivedStateOf` 最主要的作用是什么？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 4: TYPING ---
  {
    id: 7,
    speaker: "Rin",
    text: "很好。现在把这个“望远镜”的制作方法记在脑子里。特别是要记得用 `remember` 包裹它。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "val show by remember { derivedStateOf { index > 0 } }"
      }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "记住：当一个状态变化频率很高（如滚动），但 UI 只关心一个变化频率很低的结果（如是否显示）时，必用 derivedStateOf。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "实战演练。写一个逻辑：当列表滚动超过 5 项时，才显示“回到顶部”按钮。要求使用 `derivedStateOf`。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `rememberLazyListState`。创建一个 `val showButton`，利用 `derivedStateOf` 判断 `firstVisibleItemIndex > 5`。"
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "轻松登顶！我有力气在山顶煮火锅啦！这都是望远镜的功劳！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
