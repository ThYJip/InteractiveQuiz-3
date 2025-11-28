
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: HETEROGENEOUS INTRO ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱！你看，我把所有东西都塞进包里了！有锅、有衣服、还有帐篷！但是找起来好麻烦啊……",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子打开一个乱糟糟的巨大背包，里面的东西混作一团，锅碗瓢盆和衣服纠缠在一起。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "这可不行。在代码里，这叫“异构列表”。如果不分类处理，代码也会像你的背包一样乱。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 😕 混乱的列表处理
// 试图用同一个 Composable 处理所有类型，逻辑复杂且脆弱
items(allItems) { item ->
    if (item.type == "Food") {
        FoodView(item)
    } else if (item.type == "Tent") {
        TentView(item)
    } else {
        UnknownView(item)
    }
}`
    }
  },
  {
    id: 3,
    speaker: "Rin",
    text: "最好的办法是使用“密封接口”(Sealed Interface) 来分类。然后在 LazyColumn 里根据类型分发给不同的 UI。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'HETERO_VISUALIZER' }
    }
  },

  // --- ACT 2: THE KEY CRISIS ---
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "好！我分类整理好了！我还给每个杯子贴了“已清洗”的标签（状态）。但是……当我拿走第一个杯子时，标签好像贴错了？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'STATE_DRIFT_BUG' }
    }
  },
  {
    id: 5,
    speaker: "Rin",
    text: "这就是 Compose 的“位置记忆”问题。你没给杯子贴身份证 (Key)，Compose 只记得“第2个位置是已清洗”，当你拿走第1个，原本的第2个变成了第1个，状态就乱套了。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "三个杯子在移动，但是里面的果汁（代表状态）却神奇地留在了原地，导致空的杯子突然有了果汁。"
    }
  },

  // --- ACT 3: THE KEY SOLUTION ---
  {
    id: 6,
    speaker: "Sensei",
    text: "要解决这个问题，必须给每个列表项一个独一无二的 key。这样 Compose 就能认出“还是那个杯子”，而不是“那个位置”。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'KEY_FIX' }
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 7,
    speaker: "Sensei",
    text: "来考考你。如果我不写 key，默认情况下 Compose 是用什么来作为 key 的？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: TYPING ---
  {
    id: 8,
    speaker: "Nadeshiko",
    text: "是用“位置”！我记住了！我要把加上 key 的代码抄写下来，贴在背包上警示自己！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "items(items, key = { it.id }) { item -> ItemRow(item) }"
      }
    }
  },

  // --- ACT 6: SUMMARY ---
  {
    id: 9,
    speaker: "Rin",
    text: "分类处理让列表整洁，Key 让列表状态稳定。这两点是构建复杂列表的基石。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 7: AI CHALLENGE ---
  {
    id: 10,
    speaker: "Rin",
    text: "最后，写一个支持多种消息类型（文本/图片）的聊天列表代码，并且必须加上 key。让我看看你能不能处理真实场景。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 LazyColumn 渲染一个聊天记录列表 `messages`。消息可能是 `TextMessage` 或 `ImageMessage`（使用 when 判断）。最重要的：必须正确设置 `key` 参数以优化性能和状态保持。"
      }
    }
  },

  // --- ACT 8: VICTORY ---
  {
    id: 11,
    speaker: "Nadeshiko",
    text: "背包整理得井井有条，杯子也不会弄混了！这就叫“专业露营”！",
    viewType: "VICTORY",
    viewContent: {}
  }
];