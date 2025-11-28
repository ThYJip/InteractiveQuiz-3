
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: CRISIS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "出发啦！为了这次长途露营，我准备了整整 1000 种零食！我要把它们全部列在我的手机清单上！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子背着一个巨大的登山包，旁边堆满了山一样的零食盒子。她正兴奋地拿着手机输入清单。"
    }
  },
  {
    id: 2,
    speaker: "Chi",
    text: "等一下，抚子！如果你用普通的 `Column` 把这 1000 个项目一次性画出来，手机会……",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "小奇猫一脸惊恐地看着抚子的手机，手机屏幕上显示着加载圈，似乎卡死了。"
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "哇啊啊！手机好烫！画面卡住不动了！为什么会这样？我只是想列个清单而已！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'PACKING_CRISIS' }
    }
  },

  // --- ACT 2: SOLUTION ---
  {
    id: 4,
    speaker: "Rin",
    text: "因为 `Column` 是个“耿直的打包员”，它会一次性把 1000 个组件全部创建并渲染出来，不管你能不能看见。内存当然会爆炸。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 错误的打包方式：Column
// 就像把所有行李一次性倒在地板上
Column {
    // 💥 循环创建 1000 个 Text 组件
    // 瞬间消耗大量 CPU 和内存
    items.forEach { item ->
        Text(text = item.name)
    }
}`
    }
  },
  {
    id: 5,
    speaker: "Rin",
    text: "试试 `LazyColumn` 吧。它是个“聪明的打包员”，只处理你眼前能看到的那几个项目。这就叫“虚拟化”(Virtualization)。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'LAZY_SOLUTION' }
    }
  },

  // --- ACT 3: PADDING QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "在整理清单时，我们要给内容加点空隙（Padding）。但是，加在 `Modifier` 上还是 `contentPadding` 参数里？这可是新手最容易踩的坑。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'PADDING_QUIZ' }
    }
  },

  // --- ACT 4: TYPING ---
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "原来如此！`contentPadding` 才是正解！好，为了记住这个“聪明的打包法”，我要把它记在小本本上！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "items(snackList) { snack -> SnackItem(snack) }"
      }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "看来你已经掌握了基础。但在出发前，这些核心规则一定要记牢。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI CHALLENGE ---
  {
    id: 9,
    speaker: "Rin",
    text: "最后是进阶试炼。如果列表项会发生移动或删除，你需要给每个项目贴上唯一的“身份证” (`key`)。写一段代码来实现它。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `items` DSL 渲染一个 `messages` 列表。要求：必须使用 `key` 参数，将消息的 `id` 作为唯一标识，以确保滚动和更新时的性能。"
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "太好了！清单整理完毕，丝般顺滑！出发去露营咯！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
