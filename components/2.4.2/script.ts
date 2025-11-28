import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  {
    id: 1,
    speaker: "Chi",
    text: "大家好！我是小奇（Little Chi）！欢迎来到 Compose 露营地。今天我们要学习两个最重要的装备之一：状态管理。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "一只可爱的斑纹猫（小奇）坐在野餐垫上，头上冒着问号。背景是温馨的露营地。"
    }
  },
  {
    id: 2,
    speaker: "Chi",
    text: "一次完美的露营离不开协作。但是，如果大家各自为战，信息无法共享，会发生什么呢？",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛和抚子分别坐在各自的帐篷里看地图。中间有一个红色的叉号，表示她们无法交流。"
    }
  },
  {
    id: 3,
    speaker: "Chi",
    text: "就像这两个帐篷，如果它们是“有状态”(Stateful) 的组件，它们自己管理自己的数据。外面的控制塔（父组件）完全没法插手！",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 有状态组件 (Stateful)
// 就像封闭的帐篷，外面的人不知道里面发生了什么

@Composable
fun Tent() {
    // 🔒 状态被锁死在组件内部
    var mapLocation by remember { mutableStateOf("Tokyo") }
    
    // ... UI 代码 ...
}`
    }
  },
  {
    id: 4,
    speaker: "Chi",
    text: "天黑了，我们需要点亮营地的“共享提灯”。请试着操作下面的两个滑块，看看能不能把亮度同步？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'STATEFUL_PROBLEM' }
    }
  },
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "哎呀！不管怎么滑，左边和右边都是各亮各的！这就像我们无法同步地图路线一样，太糟糕了！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子失望地看着两个亮度不一的灯泡，小奇在一旁挠头。"
    }
  },
  {
    id: 6,
    speaker: "Sensei",
    text: "这时候就需要“状态提升”(State Hoisting)！我们要把状态从子组件里拿出来，放到它们共同的父组件（控制塔）里去。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "一位慈祥的老爷爷（前辈）指着营火旁的大地图。凛和抚子都凑过来看同一张地图。"
    }
  },
  {
    id: 7,
    speaker: "Chi",
    text: "我们把组件改造成“无状态”(Stateless) 的。数据从上面传下来 (value)，修改请求往上面抛出去 (onValueChange)。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 无状态组件 (Stateless)
// 就像一个显示器，显示什么由外面决定

@Composable
fun StatelessSlider(
    value: Float,           // ⬇️ 数据下行：当前亮度
    onValueChange: (Float) -> Unit // ⬆️ 事件上行：请求修改
) {
    Slider(value = value, onValueChange = onValueChange)
}`
    }
  },
  {
    id: 8,
    speaker: "Chi",
    text: "来试试吧！这次我们使用了状态提升。拖动任意一个滑块，看看提灯会发生什么变化？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'HOISTED_SOLUTION', targetMatch: 0.8 }
    }
  },
  {
    id: 9,
    speaker: "Rin",
    text: "看！它动起来了！这就是“单向数据流”的魔力。通过状态提升，我们实现了组件间的完美通信。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛开心地指着中间明亮的提灯，两个滑块整齐地停在同一个位置。"
    }
  },
  {
    id: 10,
    speaker: "Chi",
    text: "恭喜你点亮了营地！记住黄金法则：当状态需要被共享时，就提升它！Happy Camping!",
    viewType: "VICTORY",
    viewContent: {}
  }
];