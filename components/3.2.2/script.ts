
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: MANUAL CHAOS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱！我要把这个帐篷（TopBar）、那个篝火（BottomBar）还有睡袋（Content）都摆好！可是……它们好像在打架？",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子在营地上手忙脚乱地摆放装备，但是帐篷塌了盖住了睡袋，篝火又把帐篷烧了个洞，乱成一团。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "你这是在用 `Box` 手动布局吧？如果不计算好位置，它们当然会重叠。这也太原始了。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'MANUAL_CHAOS' }
    }
  },
  
  // --- ACT 2: SCAFFOLD SOLUTION ---
  {
    id: 3,
    speaker: "Rin",
    text: "用 `Scaffold`（脚手架）吧。它就像一张标准的营地规划图，早就给你留好了放帐篷、篝火和睡袋的位置。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🏗️ 标准化施工：Scaffold
Scaffold(
    topBar = { TopAppBar(...) },      // 顶栏槽位
    bottomBar = { BottomAppBar(...) },// 底栏槽位
    floatingActionButton = { FAB(...) }// 悬浮按钮槽位
) { innerPadding ->
    // ⚠️ 关键：主体内容必须应用 innerPadding！
    // 否则内容会被顶栏和底栏遮挡
    Content(modifier = Modifier.padding(innerPadding))
}`
    }
  },

  // --- ACT 3: SCAFFOLD DEMO ---
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "哇！只要把东西放进对应的“坑”里，它们就会自动对齐！再也不用我拿尺子量了！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SCAFFOLD_DEMO' }
    }
  },

  // --- ACT 4: PADDING TRAP ---
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "等等……虽然看起来整齐了，但是我的“最后一块肉”（列表最后一项）怎么不见了？好像被底下的栏杆挡住了？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'PADDING_TRAP' }
    }
  },

  // --- ACT 5: QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "这就是所谓的“Padding 契约”。Scaffold 给了你一个 `innerPadding`，如果你无视它，内容就会被遮挡。考考你，这个 PaddingValues 代表了什么？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 6: TYPING ---
  {
    id: 7,
    speaker: "Rin",
    text: "记住，必须把这个 padding 传给内容的 `Modifier`。这是使用 Scaffold 的第一铁律。现在，把修正代码写下来。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "Modifier.padding(innerPadding)"
      }
    }
  },

  // --- ACT 7: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "Scaffold 是 Material Design 的基石。掌握了它，你的页面结构就稳如泰山了。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 8: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "最后，用 Scaffold 搭建一个完整的页面。要求：包含一个 FAB（悬浮按钮）和一个简单的 Content，并且**必须**正确处理 padding。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `Scaffold`。添加一个 `floatingActionButton`。在 `content` 中放置一个 `Text`，并确保 `Text` 应用了 `innerPadding` 以避免被遮挡。"
      }
    }
  },

  // --- ACT 9: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "这下营地彻底搭建完美了！连角落里的蚂蚁（底部内容）都能看清楚了！我们是最棒的工头！",
    viewType: "VICTORY",
    viewContent: {}
  }
];