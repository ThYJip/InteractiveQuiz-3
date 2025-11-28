import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱！你看我用 `remember` 记住了好多松果！这次就算怎么点按钮，它们都不会丢啦！我真是天才！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子骄傲地举着装满松果的篮子，屏幕上飘浮着代码 `remember { ... }` 的气泡。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "是吗？那如果森林里突然刮起一阵大风呢？（或者你把手机旋转一下？）",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛面无表情地看着抚子，背景里树木被风吹得摇晃。凛的手做了一个旋转手机的动作。"
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "欸？旋转屏幕？这有什么关系吗？让我试试看……",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'ROTATION_PROBLEM' }
    }
  },
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "啊啊啊！我的松果！怎么全部清零了！！明明用了 `remember` 啊，为什么会这样？！",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🌪️ 灾难现场：屏幕旋转 (Configuration Change)

// 1. 用户旋转屏幕 -> 系统销毁当前 Activity
Activity.onDestroy() 
// 💀 内存被清空！remember 存储在内存里，所以也一起“死”了。

// 2. 系统重建 Activity
Activity.onCreate()
// 🐣 一切重头开始。
var count by remember { mutableStateOf(0) } // 又变成了 0`
    }
  },
  {
    id: 5,
    speaker: "Rin",
    text: "`remember` 只能在“重组”中存活，但活不过“Activity 销毁”。想要抵御“大风”（销毁重建），你需要把数据锁进保险箱里。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛递给抚子一个小小的、结实的金属保险箱，上面写着 Bundle。"
    }
  },
  {
    id: 6,
    speaker: "Rin",
    text: "使用 `rememberSaveable`。它不仅能记住数据，还会把数据自动打包保存到 Bundle (SavedInstance) 里。这样即使 Activity 重建，数据也能恢复。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 正确写法：使用 rememberSaveable

@Composable
fun PineconeCounter() {
    // 🛡️ rememberSaveable: 
    // "把这个值存到 Bundle 里！即使 Activity 死了也要救回来！"
    var count by rememberSaveable { mutableStateOf(0) }
    
    Button(onClick = { count++ }) { ... }
}`
    }
  },
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "原来还有这种操作！就像把松果藏进了防风地窖！再让我试一次！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SAVABLE_FIX' }
    }
  },
  {
    id: 8,
    speaker: "Nadeshiko",
    text: "太好了！不管怎么旋转，松果都在！这就是持久化（Persistence）的力量吗？感觉自己变强了！",
    viewType: "VICTORY",
    viewContent: {}
  }
];