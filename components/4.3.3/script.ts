
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: COUPLING CRISIS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱！我要参加跑步比赛！但是我只认你做队长。如果队长不是你，我就不跑了！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子紧紧抱着接力棒，一脸固执。旁边的小奇想接棒，但被她拒绝了。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "你这样太死板了。这就是“紧耦合”。如果你的代码里写死了 `viewModel.doSomething()`，那这个组件就废了，没法在预览或者测试里用。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ❌ 错误：紧耦合 (Coupled)
// 这个组件只能在有特定 ViewModel 的地方用
// 没法 Preview，也没法复用！
@Composable
fun Runner(vm: RaceViewModel) {
    Button(onClick = { vm.run() }) {
        Text("Run!")
    }
}`
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "啊？真的吗？那我不就成了没人要的跑者了吗？快让我看看后果！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'COUPLED_CRASH' }
    }
  },

  // --- ACT 2: EVENT HOISTING ---
  {
    id: 4,
    speaker: "Chi",
    text: "你需要“事件提升”(Event Hoisting)。就像接力赛，你只需要把棒子（事件）递出去，不用管接棒的是谁（Lambda）。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 正确：事件提升 (Decoupled)
// 这是一个无状态组件，只接收一个函数回调
// 可以在任何地方用！Preview, Testing, Real App...
@Composable
fun Runner(onRun: () -> Unit) {
    Button(onClick = onRun) {
        Text("Run!")
    }
}`
    }
  },
  {
    id: 5,
    speaker: "Rin",
    text: "试试看。如果你只负责传递事件，不管是在真正的比赛中（连接 ViewModel），还是在练习赛中（连接空函数），你都能跑得飞快。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'RELAY_SUCCESS' }
    }
  },

  // --- ACT 3: QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "考考你。为什么我们将事件回调设计为 `() -> Unit` 这样的 Lambda，而不是传递 ViewModel 实例？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 4: TYPING ---
  {
    id: 7,
    speaker: "Chi",
    text: "没错，是为了解耦。现在，我们要把这种“传递函数引用”的高级技巧练熟。在顶层，我们可以直接把 ViewModel 的函数传进去。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "onEvent = viewModel::onEvent"
      }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "事件提升是 Compose 架构的灵魂。它打通了 UI 到 ViewModel 的回路，同时保持了组件的纯净。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "最后的任务。重构这段代码。把那个死板的 `LoginButton` 改造成灵活的、接收 Lambda 的组件。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：重构 `fun LoginButton(vm: LoginViewModel)`。将其改为接收一个 `onClick: () -> Unit` 参数，并在内部调用它。移除对 ViewModel 的依赖。"
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "我明白了！只要我跑得快（组件独立），谁接棒（逻辑处理）都没关系！我是自由的跑者！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
