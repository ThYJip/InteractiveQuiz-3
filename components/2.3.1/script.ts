import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "哇！这里的森林好棒！地上有好多松果！我要把它们捡回去生火~ 嘿咻，嘿咻……",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子在森林里开心地弯腰捡松果，手里提着一个小篮子，背景是郁郁葱葱的树木。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "既然要捡，我就写个小程序来记录捡了多少个吧！很简单嘛，用个变量 count 记一下就行！",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 错误的计数器写法
@Composable
fun PineconeCounter() {
    // ⚠️ 普通变量：每次函数运行时，它都会重新变成 0
    var count = 0 
    
    Button(onClick = { count++ }) {
        Text("捡到一个松果！当前数量: $count")
    }
}`
    }
  },
  {
    id: 3,
    speaker: "Rin",
    text: "呃……抚子，你确定这样行得通吗？Compose 的函数可是会反复执行的哦。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛骑着摩托车停在一旁，摘下头盔，一脸怀疑地看着抚子手中的代码板。"
    }
  },
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "没问题没问题！看我的！……咦？奇怪？我明明捡了好几个，为什么篮子里永远是 0 个？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'AMNESIA_BUG' }
    }
  },
  {
    id: 5,
    speaker: "Rin",
    text: "果然变成“失忆森林”了。你看，每次你点击按钮，UI 需要刷新（重组），函数就会重新跑一遍。`var count = 0` 这句话也会重跑，结果就是——清零。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔄 重组 (Recomposition) 过程模拟：

// 第一次渲染：
fun PineconeCounter() {
   var count = 0 // -> 0
   // 显示 0
}

// 点击后，UI 刷新，函数再次运行：
fun PineconeCounter() {
   var count = 0 // -> 又变成了 0！之前的 1 被丢掉了！
   // 依然显示 0
}`
    }
  },
  {
    id: 6,
    speaker: "Rin",
    text: "想要让函数“拥有记忆”，你需要 `remember`。它能把数据存在 Compose 的内存槽里，不管函数跑多少遍，它都能记住所存的值。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 正确写法：使用 remember 和 mutableStateOf

@Composable
fun PineconeCounter() {
    // ✨ remember: "记住这个值，下次重组时直接还给我，不要重置"
    // ✨ mutableStateOf: "如果值变了，通知 UI 刷新"
    var count by remember { mutableStateOf(0) }
    
    Button(onClick = { count++ }) {
        Text("捡到松果！数量: $count")
    }
}`
    }
  },
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "原来是这样！就像给变量穿上了一件“防遗忘斗篷”！让我再试一次，这次一定能装满篮子！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'REMEMBER_FIX', targetCount: 5 }
    }
  },
  {
    id: 8,
    speaker: "Nadeshiko",
    text: "太棒了！松果只要捡到就不会丢了！今晚的篝火有着落啦！",
    viewType: "VICTORY",
    viewContent: {}
  }
];