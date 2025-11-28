
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: BROKEN PEN (CRISIS) ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "在这么美的山谷里，我要给千明写一张明信片！拿出我最喜欢的钢笔……",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子坐在折叠椅上，对着壮丽的山谷景色，手里拿着明信片和钢笔，正准备写字。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "咦？为什么我写了字，纸上却什么都没显示？这支笔坏了吗？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BROKEN_PEN' }
    }
  },
  
  // --- ACT 2: UDF SOLUTION ---
  {
    id: 3,
    speaker: "Rin",
    text: "不是笔坏了，是这里的“回声法则”（单向数据流）。在 Compose 里，输入框自己是没有记忆的。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🚫 错误：没有状态更新
TextField(
    value = text, // 如果 text 永远不变...
    onValueChange = { newText -> 
       // ...而且你忽略了新输入的内容...
    }
)
// 结果：输入框永远显示旧的 text，看起来就像坏了一样。`
    }
  },
  {
    id: 4,
    speaker: "Rin",
    text: "你喊一声（输入），必须听到回声（更新状态），声音（文字）才会真的出现。来体验一下这个循环。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'UDF_LOOP' }
    }
  },

  // --- ACT 3: DECORATION ---
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "原来如此！只要我把新字写进状态里，它就会显示出来！现在我要把明信片装饰得漂漂亮亮的！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'DECORATION' }
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "考考你。`onValueChange` 回调里的那个 String 参数，代表了什么？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: TYPING ---
  {
    id: 7,
    speaker: "Rin",
    text: "正确。它代表了“如果被接受，文本框将要显示的内容”。好，现在把标准的 TextField 写法记在脑子里。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "TextField(value = text, onValueChange = { text = it })"
      }
    }
  },

  // --- ACT 6: SUMMARY ---
  {
    id: 8,
    speaker: "Sensei",
    text: "TextField 是受控组件的典范。牢记：UI 只是状态的投影。状态不变，UI 不变。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 7: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "试炼时间。写一个简单的登录输入框逻辑。你需要定义一个 `username` 状态，并将其绑定到 TextField。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `remember { mutableStateOf(\"\") }` 创建一个状态。然后创建一个 `TextField`，将状态绑定到 `value` 和 `onValueChange`。"
      }
    }
  },

  // --- ACT 8: FINAL PROJECT ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "最后，我们要制作一个完整的“明信片编辑器”！包含收件人和正文。一步步来！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: {
          mode: 'FINAL_PROJECT'
      }
    }
  },

  // --- ACT 9: VICTORY ---
  {
    id: 11,
    speaker: "Nadeshiko",
    text: "明信片写好啦！千明一定会喜欢的！这就是单向数据流的默契！",
    viewType: "VICTORY",
    viewContent: {}
  }
];