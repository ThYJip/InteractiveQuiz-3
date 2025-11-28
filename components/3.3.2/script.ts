import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: HIERARCHY CRISIS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "天快黑了，要生火做饭！我面前有一个控制台，但是这三个按钮长得一模一样……哪个是点火，哪个是加柴啊？",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子面对着一个复杂的露营炉具控制面板，上面有三个灰色的方块按钮，一脸困惑。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "不管了，随便点一个试试！……哎呀！不小心按到“取消”把炉子关掉了！呜呜呜……",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'HIERARCHY_CRISIS' }
    }
  },
  
  // --- ACT 2: SOLUTION ---
  {
    id: 3,
    speaker: "Rin",
    text: "这就是没有“视觉层级”的后果。按钮分为三六九等：实心(Button)用于主要动作，空心(Outlined)用于次要动作，文字(Text)用于辅助。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🎨 按钮三兄弟
Row {
    // 🥇 主角：实心背景，最显眼
    Button(onClick = { fire() }) { Text("点火") }

    // 🥈 配角：有边框无背景
    OutlinedButton(onClick = { addWood() }) { Text("加柴") }

    // 🥉 龙套：无边框无背景
    TextButton(onClick = { cancel() }) { Text("取消") }
}`
    }
  },

  // --- ACT 3: HIERARCHY LAB ---
  {
    id: 4,
    speaker: "Rin",
    text: "来，帮抚子重新设计一下控制台。把正确的按钮样式拖到对应的功能上。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'HIERARCHY_FIX' }
    }
  },

  // --- ACT 4: LOGIC CRISIS ---
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "按钮分清楚了！那我现在就点火！……咦？怎么点不着？啊！炉子里没有柴火！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子拼命按“点火”按钮，但是炉子里空空如也，只有冷风吹过。"
    }
  },

  // --- ACT 5: ENABLED SOLUTION ---
  {
    id: 6,
    speaker: "Sensei",
    text: "在程序中，如果不满足条件（比如没柴火），按钮应该是“不可用”的。使用 `enabled` 参数，让状态来驱动按钮。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔒 声明式禁用
// 不需要手动去调用 button.setEnabled(false)
// 只要 woodCount == 0，按钮自动变灰、不可点击

Button(
    onClick = { ignite() },
    enabled = woodCount > 0 // 👈 状态驱动 UI
) {
    Text("点火")
}`
    }
  },

  // --- ACT 6: LOGIC LAB ---
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "原来如此！只要没有木柴，点火按钮就应该是灰色的按不动！让我再试一次！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'ENABLED_LOGIC' }
    }
  },

  // --- ACT 7: QUIZ ---
  {
    id: 8,
    speaker: "Sensei",
    text: "既然你已经懂了视觉层级。那么在弹窗（Dialog）里的“取消”按钮，通常应该用哪种样式？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 8: TYPING ---
  {
    id: 9,
    speaker: "Rin",
    text: "没错，用 TextButton 降低干扰。现在，把控制按钮可用性的代码记在脑子里。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "enabled = woodCount > 0"
      }
    }
  },

  // --- ACT 9: AI ASSIGNMENT ---
  {
    id: 10,
    speaker: "Rin",
    text: "最后，去写一个“登录”按钮。要求：只有当输入框有文字时，按钮才可用。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：创建一个 Button。只有当 `text.isNotEmpty()` 为 true 时，该按钮才处于 enabled 状态。"
      }
    }
  },

  // --- ACT 10: VICTORY ---
  {
    id: 11,
    speaker: "Nadeshiko",
    text: "篝火生起来了！温暖又明亮！按钮的学问真大呀！",
    viewType: "VICTORY",
    viewContent: {}
  }
];