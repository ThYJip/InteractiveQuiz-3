
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: SCROLL CRISIS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "这次露营我们要邀请好多人！我正在核对这张超级长的嘉宾名单……可是，每次滑到底部再滑回顶部，手指都好累哦！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子手里拿着一张比她身高还长的卷轴名单，满头大汗地上下挥舞，看起来精疲力尽。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "笨蛋。你需要给列表配一个“遥控器”。在 Compose 里，那就是 `LazyListState`。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 📱 列表的遥控器
val listState = rememberLazyListState() // 创建遥控器
val scope = rememberCoroutineScope() // 准备发射信号的电台

LazyColumn(state = listState) { // 把遥控器绑定到列表
    items(100) { Text("Guest #$it") }
}

// 🕹️ 按下按钮，遥控列表
Button(onClick = { 
    scope.launch { 
        listState.animateScrollToItem(0) // 发送信号：滚回顶部！
    } 
}) { Text("Top") }`
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "喔！原来还能这样！有了遥控器，我就能一键回到顶部了！让我试试看！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SCROLL_REMOTE' }
    }
  },

  // --- ACT 2: STICKY HEADER CRISIS ---
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "名单问题解决了，但是……大家到了营地后乱哄哄的，分不清谁是哪个组的（A组、B组……）。划着划着就忘了当前是哪个组了。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "露营地上人山人海，大家混在一起。抚子拿着扩音器茫然四顾，分不清谁是A组谁是B组。"
    }
  },
  {
    id: 5,
    speaker: "Sensei",
    text: "这时候你需要“队旗”（Sticky Header）。无论队伍怎么走，队旗始终飘扬在最显眼的地方（顶部），直到下一组的队旗把它替换掉。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'STICKY_VISUALIZER' }
    }
  },

  // --- ACT 3: QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "考考你。我们要判断列表是否滚动到了“最底部”，应该检查 listState 的哪个属性？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 4: GUIDED TYPING ---
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "原来 `firstVisibleItemIndex` 只能看头部！要看底部得用 `layoutInfo`。好，为了不忘记队旗的用法，我要抄写一遍代码！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "stickyHeader { HeaderView(title) }"
      }
    }
  },

  // --- ACT 5: TECH SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "掌握了遥控器和队旗，你现在是真正的“列表指挥官”了。复习一下。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "去实战吧。写一个带有 `LazyListState` 的列表，并且当滚动超过第 5 项时，显示一个“回到顶部”的按钮。我会检查逻辑。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：创建一个 LazyColumn 并绑定 listState。使用 `derivedStateOf` 监听 `listState.firstVisibleItemIndex > 5`。如果条件满足，显示一个 Button，点击后调用 `animateScrollToItem(0)`。"
      }
    }
  },

  // --- ACT 7: FINAL PROJECT (MULTI-STEP) ---
  {
    id: 10,
    speaker: "Sensei",
    text: "最后，我们要构建一个完整的、带分组吸顶效果的通讯录列表。一步步来，稳扎稳打。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: {
          mode: 'FINAL_PROJECT'
      }
    }
  },

  // --- ACT 8: VICTORY ---
  {
    id: 11,
    speaker: "Nadeshiko",
    text: "太棒了！所有人都井井有条，我想去哪里就去哪里！这就叫“运筹帷幄”！",
    viewType: "VICTORY",
    viewContent: {}
  }
];